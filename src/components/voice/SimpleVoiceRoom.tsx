import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, PhoneOff, Phone, Users, Volume2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { VoiceChatInviteDialog } from "./VoiceChatInviteDialog";

interface Participant {
  id: string;
  name: string;
  isMuted: boolean;
  isSpeaking?: boolean;
}

interface SimpleVoiceRoomProps {
  roomId: string;
  userId: string;
  userName: string;
  roomName?: string;
  className?: string;
}

export function SimpleVoiceRoom({ roomId, userId, userName, roomName, className }: SimpleVoiceRoomProps) {
  const [isInRoom, setIsInRoom] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const pendingIceCandidatesRef = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());

  const iceConfig: RTCConfiguration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  const cleanup = useCallback(() => {
    console.log("[Voice] Cleaning up...");
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    localStreamRef.current = null;

    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();
    pendingIceCandidatesRef.current.clear();

    audioElementsRef.current.forEach(audio => {
      audio.pause();
      audio.srcObject = null;
    });
    audioElementsRef.current.clear();

    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
  }, []);

  const processPendingIceCandidates = useCallback(async (remoteUserId: string) => {
    const pc = peerConnectionsRef.current.get(remoteUserId);
    const pending = pendingIceCandidatesRef.current.get(remoteUserId);
    
    if (pc && pc.remoteDescription && pending && pending.length > 0) {
      console.log(`[Voice] Processing ${pending.length} pending ICE candidates for ${remoteUserId}`);
      for (const candidate of pending) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.warn("[Voice] Failed to add pending ICE candidate:", e);
        }
      }
      pendingIceCandidatesRef.current.set(remoteUserId, []);
    }
  }, []);

  const createPeerConnection = useCallback((remoteUserId: string): RTCPeerConnection => {
    console.log(`[Voice] Creating peer connection for: ${remoteUserId}`);
    
    // Close existing connection if any
    const existingPc = peerConnectionsRef.current.get(remoteUserId);
    if (existingPc) {
      console.log(`[Voice] Closing existing connection for: ${remoteUserId}`);
      existingPc.close();
      peerConnectionsRef.current.delete(remoteUserId);
    }
    
    const pc = new RTCPeerConnection(iceConfig);
    peerConnectionsRef.current.set(remoteUserId, pc);

    // Add local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        console.log(`[Voice] Adding track: ${track.kind}`);
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        console.log(`[Voice] Sending ICE candidate to ${remoteUserId}`);
        channelRef.current.send({
          type: "broadcast",
          event: "ice",
          payload: {
            candidate: event.candidate.toJSON(),
            from: userId,
            to: remoteUserId,
          },
        });
      }
    };

    pc.ontrack = (event) => {
      console.log(`[Voice] Received track from: ${remoteUserId}`, event.track.kind);
      const [stream] = event.streams;
      
      let audio = audioElementsRef.current.get(remoteUserId);
      if (!audio) {
        audio = new Audio();
        audio.autoplay = true;
        audioElementsRef.current.set(remoteUserId, audio);
      }
      audio.srcObject = stream;
      audio.play().catch(e => console.log("[Voice] Audio play error:", e));
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`[Voice] ICE state with ${remoteUserId}: ${pc.iceConnectionState}`);
    };

    pc.onconnectionstatechange = () => {
      console.log(`[Voice] Connection state with ${remoteUserId}: ${pc.connectionState}`);
      if (pc.connectionState === "connected") {
        toast.success(`Connected to voice`);
      } else if (pc.connectionState === "failed") {
        toast.error(`Voice connection failed`);
      }
    };

    return pc;
  }, [userId, iceConfig]);

  const sendOffer = useCallback(async (remoteUserId: string) => {
    console.log(`[Voice] Sending offer to: ${remoteUserId}`);
    const pc = createPeerConnection(remoteUserId);

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      channelRef.current?.send({
        type: "broadcast",
        event: "offer",
        payload: {
          sdp: offer.sdp,
          type: offer.type,
          from: userId,
          to: remoteUserId,
        },
      });
    } catch (e) {
      console.error("[Voice] Error creating offer:", e);
    }
  }, [createPeerConnection, userId]);

  const handleOffer = useCallback(async (payload: any) => {
    if (payload.to !== userId) return;
    console.log(`[Voice] Received offer from: ${payload.from}`);

    const pc = createPeerConnection(payload.from);

    try {
      await pc.setRemoteDescription({ type: payload.type, sdp: payload.sdp });
      await processPendingIceCandidates(payload.from);
      
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      channelRef.current?.send({
        type: "broadcast",
        event: "answer",
        payload: {
          sdp: answer.sdp,
          type: answer.type,
          from: userId,
          to: payload.from,
        },
      });
    } catch (e) {
      console.error("[Voice] Error handling offer:", e);
    }
  }, [createPeerConnection, userId, processPendingIceCandidates]);

  const handleAnswer = useCallback(async (payload: any) => {
    if (payload.to !== userId) return;
    console.log(`[Voice] Received answer from: ${payload.from}`);

    const pc = peerConnectionsRef.current.get(payload.from);
    if (pc && !pc.currentRemoteDescription) {
      try {
        await pc.setRemoteDescription({ type: payload.type, sdp: payload.sdp });
        await processPendingIceCandidates(payload.from);
      } catch (e) {
        console.error("[Voice] Error setting remote description:", e);
      }
    }
  }, [userId, processPendingIceCandidates]);

  const handleIce = useCallback(async (payload: any) => {
    if (payload.to !== userId) return;

    const pc = peerConnectionsRef.current.get(payload.from);
    if (pc) {
      if (pc.remoteDescription) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
        } catch (e) {
          console.warn("[Voice] Error adding ICE candidate:", e);
        }
      } else {
        // Queue the candidate for later
        console.log(`[Voice] Queueing ICE candidate from ${payload.from}`);
        const pending = pendingIceCandidatesRef.current.get(payload.from) || [];
        pending.push(payload.candidate);
        pendingIceCandidatesRef.current.set(payload.from, pending);
      }
    }
  }, [userId]);

  const joinRoom = async () => {
    setIsConnecting(true);
    try {
      // Get microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      localStreamRef.current = stream;

      // Create channel
      const channel = supabase.channel(`voice-${roomId}`, {
        config: { presence: { key: userId } },
      });
      channelRef.current = channel;

      // Handle presence
      channel.on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const users: Participant[] = [];
        
        Object.entries(state).forEach(([key, presences]) => {
          const p = (presences as any[])[0];
          if (p) {
            users.push({
              id: key,
              name: p.name || key.slice(0, 8),
              isMuted: p.isMuted || false,
            });
          }
        });
        
        setParticipants(users);
      });

      channel.on("presence", { event: "join" }, async ({ key }) => {
        if (key !== userId) {
          console.log(`[Voice] User joined: ${key}`);
          // Delay slightly and lower ID initiates
          setTimeout(() => {
            if (userId < key) {
              sendOffer(key);
            }
          }, 500);
        }
      });

      channel.on("presence", { event: "leave" }, ({ key }) => {
        console.log(`[Voice] User left: ${key}`);
        const pc = peerConnectionsRef.current.get(key);
        if (pc) {
          pc.close();
          peerConnectionsRef.current.delete(key);
        }
        pendingIceCandidatesRef.current.delete(key);
        const audio = audioElementsRef.current.get(key);
        if (audio) {
          audio.pause();
          audio.srcObject = null;
          audioElementsRef.current.delete(key);
        }
      });

      // Handle signaling
      channel.on("broadcast", { event: "offer" }, ({ payload }) => handleOffer(payload));
      channel.on("broadcast", { event: "answer" }, ({ payload }) => handleAnswer(payload));
      channel.on("broadcast", { event: "ice" }, ({ payload }) => handleIce(payload));

      await channel.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ name: userName, isMuted: false });
          setIsInRoom(true);
          setIsConnecting(false);
          toast.success("Joined voice room");
          
          // Connect to existing participants after a delay
          setTimeout(() => {
            const state = channel.presenceState();
            Object.keys(state).forEach(key => {
              if (key !== userId && userId < key) {
                console.log(`[Voice] Connecting to existing user: ${key}`);
                sendOffer(key);
              }
            });
          }, 1000);
        }
      });
    } catch (error) {
      console.error("Error joining room:", error);
      setIsConnecting(false);
      toast.error("Failed to join. Check microphone permissions.");
      cleanup();
    }
  };

  const leaveRoom = () => {
    cleanup();
    setIsInRoom(false);
    setIsMuted(false);
    setParticipants([]);
    toast.info("Left voice room");
  };

  const toggleMute = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
      
      // Update presence
      channelRef.current?.track({ name: userName, isMuted: !track.enabled });
    }
  };

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  if (!isInRoom) {
    return (
      <Button
        onClick={joinRoom}
        disabled={isConnecting}
        variant="outline"
        className={cn("gap-2", className)}
      >
        <Phone className="h-4 w-4" />
        {isConnecting ? "Connecting..." : "Join Voice"}
      </Button>
    );
  }

  return (
    <Card className={cn("bg-card/50 backdrop-blur", className)}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{participants.length} in room</span>
          </div>
          <div className="flex items-center gap-1">
            <Volume2 className="h-3 w-3 text-green-500 animate-pulse" />
            <span className="text-xs text-green-500">Live</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {participants.map((p) => (
            <div
              key={p.id}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
                p.id === userId
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {p.isMuted ? (
                <MicOff className="h-3 w-3 text-destructive" />
              ) : (
                <Mic className="h-3 w-3 text-green-500" />
              )}
              <span>{p.id === userId ? "You" : p.name}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={toggleMute}
            variant={isMuted ? "destructive" : "secondary"}
            size="sm"
            className="flex-1"
          >
            {isMuted ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
            {isMuted ? "Unmute" : "Mute"}
          </Button>
          <VoiceChatInviteDialog roomId={roomId} roomName={roomName || roomId} />
          <Button onClick={leaveRoom} variant="outline" size="sm">
            <PhoneOff className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
