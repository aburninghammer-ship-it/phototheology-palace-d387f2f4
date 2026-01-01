import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Square,
  Volume2,
  VolumeX,
  Loader2,
  BookOpen,
  ListMusic,
  Smartphone,
  Download,
  WifiOff,
  RotateCcw,
  RefreshCw,
  Mic,
  Share2,
  Gem,
  Save,
  Check,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { ReadingSequenceBlock, SequenceItem } from "@/types/readingSequence";
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";
import { useIsMobile } from "@/hooks/use-mobile";
import { mobileAudioEngine } from "@/lib/MobileAudioEngine";
import { getGlobalMusicVolume, setGlobalMusicVolume } from "@/hooks/useMusicVolumeControl";
import { OPENAI_VOICES, VoiceId } from "@/hooks/useTextToSpeech";
import { useGlobalAudio } from "@/contexts/GlobalAudioContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { DownloadSequenceDialog } from "./DownloadSequenceDialog";
import { OfflineModeToggle } from "./OfflineModeToggle";
import { CommentaryPDFExport } from "./CommentaryPDFExport";
import { ExportCommentaryDialog } from "./ExportCommentaryDialog";
import { ExportToStudyButton } from "@/components/ExportToStudyButton";
import {
  isOnline,
  getCachedMusicTrack,
  cacheTTSAudio,
  getCachedTTSAudio,
  cacheCommentaryAudio,
  getCachedCommentaryAudio,
  cacheVerseCommentaryAudio,
  getCachedVerseCommentaryAudio
} from "@/services/offlineAudioCache";
import { audioPreloader } from "@/services/audioPreloader";
import { 
  getCachedChapterCommentary, 
  cacheChapterCommentary,
  getCachedVerseCommentary,
  cacheVerseCommentary 
} from "@/services/offlineCommentaryCache";
import { useUserStudiesContext } from "@/hooks/useUserStudiesContext";

interface SequencePlayerProps {
  sequences: ReadingSequenceBlock[];
  onClose?: () => void;
  autoPlay?: boolean;
  sequenceName?: string;
}

interface ChapterContent {
  book: string;
  chapter: number;
  verses: { verse: number; text: string }[];
}

export const SequencePlayer = ({ sequences, onClose, autoPlay = false, sequenceName }: SequencePlayerProps) => {
  const { setBibleAudioState, updateBibleProgress, setShowMiniPlayer } = useGlobalAudio();
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSeqIdx, setCurrentSeqIdx] = useState(0);
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [currentVerseIdx, setCurrentVerseIdx] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(() => {
    const stored = getGlobalMusicVolume();
    const initial = typeof stored === "number" && !Number.isNaN(stored as any) ? (stored as number) : 80;
    const clamped = Math.max(0, Math.min(initial, 100));
    console.log('[SequencePlayer] Initial music volume:', clamped);
    return clamped;
  });
  const [chapterContent, setChapterContent] = useState<ChapterContent | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlayingCommentary, setIsPlayingCommentary] = useState(false);
  const [offlineMode, setOfflineMode] = useState(!isOnline());
  const [commentaryText, setCommentaryText] = useState<string | null>(null);
  const [completedVerseIndices, setCompletedVerseIndices] = useState<Set<number>>(new Set());
  const [currentCommentaryVerse, setCurrentCommentaryVerse] = useState<{ index: number; text: string; verse: number } | null>(null);
  const [savingGem, setSavingGem] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [savedPosition, setSavedPosition] = useState<{ seqIdx: number; itemIdx: number; verseIdx: number } | null>(null);
  const [showResumeOption, setShowResumeOption] = useState(false);

  // Get active sequences first
  const activeSequences = sequences.filter((s) => s.enabled && s.items.length > 0);

  // LocalStorage key for saving position - use sequenceName or a hash of sequences
  const positionStorageKey = `pt-audio-position-${sequenceName || 'default'}`;

  // Load saved position from localStorage AND Supabase user metadata (use most recent)
  useEffect(() => {
    const loadPosition = async () => {
      let localPosition: { seqIdx: number; itemIdx: number; verseIdx: number; timestamp: number } | null = null;
      let cloudPosition: { seqIdx: number; itemIdx: number; verseIdx: number; timestamp: number } | null = null;

      // Try localStorage first
      try {
        const saved = localStorage.getItem(positionStorageKey);
        if (saved) {
          localPosition = JSON.parse(saved);
        }
      } catch (e) {
        console.log('[SequencePlayer] Could not load local position:', e);
      }

      // Try Supabase Auth user_metadata for cross-device sync (no database changes needed!)
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata?.audio_position) {
          const cloudData = user.user_metadata.audio_position;
          // Only use cloud position if it's for the same sequence
          if (cloudData.sequenceName === sequenceName) {
            cloudPosition = cloudData;
            console.log('[SequencePlayer] Found cloud position:', cloudPosition);
          }
        }
      } catch (e) {
        console.log('[SequencePlayer] Could not load cloud position:', e);
      }

      // Use the most recent position (comparing timestamps)
      let bestPosition = localPosition;
      if (cloudPosition && (!localPosition || cloudPosition.timestamp > localPosition.timestamp)) {
        bestPosition = cloudPosition;
        console.log('[SequencePlayer] Using cloud position (more recent)');
      }

      if (bestPosition) {
        // Validate the saved position is still valid for current sequences
        if (
          bestPosition.seqIdx < activeSequences.length &&
          bestPosition.itemIdx < activeSequences[bestPosition.seqIdx]?.items?.length
        ) {
          setSavedPosition(bestPosition);
          setShowResumeOption(true);
        } else {
          // Saved position no longer valid, clear it
          localStorage.removeItem(positionStorageKey);
        }
      }
    };

    loadPosition();
  }, [positionStorageKey, activeSequences.length, sequenceName]);

  // Save current position to localStorage AND Supabase user metadata (for cross-device sync)
  const saveCurrentPosition = useCallback(async (seqIdx: number, itemIdx: number, verseIdx: number) => {
    const position = { seqIdx, itemIdx, verseIdx, timestamp: Date.now(), sequenceName };

    // Save to localStorage (always)
    try {
      localStorage.setItem(positionStorageKey, JSON.stringify(position));
    } catch (e) {
      console.log('[SequencePlayer] Could not save local position:', e);
    }

    // Save to Supabase Auth user_metadata for cross-device sync (no database changes needed!)
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.auth.updateUser({
          data: { audio_position: position }
        });
        console.log('[SequencePlayer] Saved position to cloud');
      }
    } catch (e) {
      console.log('[SequencePlayer] Could not save cloud position:', e);
    }
  }, [positionStorageKey, sequenceName]);

  const [currentVoice, setCurrentVoice] = useState<VoiceId>(() => {
    return (activeSequences[currentSeqIdx]?.voice as VoiceId) || 'onyx';
  });
  
  // Commentary depth can be changed mid-session
  const [currentCommentaryDepth, setCurrentCommentaryDepth] = useState<"surface" | "intermediate" | "depth" | "deep-drill">(() => {
    return (activeSequences[currentSeqIdx]?.commentaryDepth as "surface" | "intermediate" | "depth" | "deep-drill") || 'surface';
  });

  const musicAudioRef = useRef<HTMLAudioElement | null>(null); // Background music audio

  // Use MobileAudioEngine for all TTS audio playback
  // This handles iOS unlock, persistent audio element, and all mobile-specific concerns
  const ensureAudioUnlocked = useCallback(async (): Promise<boolean> => {
    console.log('[MobileAudio] Ensuring audio is unlocked...');
    const result = await mobileAudioEngine.unlock();
    console.log('[MobileAudio] Unlock result:', result);
    return result;
  }, []);

  // Helper to safely stop ALL audio (both mobile engine and browser TTS)
  const stopAudio = useCallback(() => {
    console.log('[MobileAudio] Stopping all audio');
    mobileAudioEngine.stop();
    // Also stop browser TTS to prevent overlapping voices
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
  }, []);

  // Helper to play audio URL using MobileAudioEngine
  const playAudioUrl = useCallback(async (
    url: string,
    options: {
      volume?: number;
      playbackRate?: number;
      onEnded?: () => void;
      onError?: (e: Event | Error) => void;
      onTimeUpdate?: () => void;
    } = {}
  ): Promise<boolean> => {
    console.log('[MobileAudio] Playing URL:', url.substring(0, 50) + '...');

    const volume = options.volume ?? (isMutedRef.current ? 0 : volumeRef.current / 100);

    return mobileAudioEngine.play(url, {
      volume,
      playbackRate: options.playbackRate ?? 1,
      onEnded: options.onEnded,
      onError: (error) => {
        if (options.onError) {
          options.onError(error);
        }
      }
    });
  }, []);
  
  // Fetch user's display name for personalized commentary
  // Extract first name from display_name for more personal address
  useEffect(() => {
    const fetchUserName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, username')
          .eq('id', user.id)
          .single();
        
        if (profile?.display_name) {
          // Extract first name (take first word before space)
          const firstName = profile.display_name.trim().split(/\s+/)[0];
          if (firstName && firstName.length > 0) {
            setUserName(firstName);
            console.log('[SequencePlayer] User first name set to:', firstName);
          } else {
            setUserName(profile.display_name);
          }
        } else if (profile?.username) {
          // Fallback to username if no display name
          setUserName(profile.username);
        }
      }
    };
    fetchUserName();
  }, []);

  // Hook for fetching user's relevant studies to incorporate into commentary
  const { fetchRelevantStudies, formatStudiesForPrompt } = useUserStudiesContext();
  const isGeneratingRef = useRef(false); // Prevent concurrent TTS requests
  const isSettingUpPlaybackRef = useRef(false); // Prevent duplicate playVerseAtIndex calls during setup
  const isFetchingChapterRef = useRef(false); // Prevent concurrent chapter fetches
  const lastFetchedRef = useRef<string | null>(null); // Track last fetched chapter
  const shouldPlayNextRef = useRef(false); // Signal to play next chapter
  const continuePlayingRef = useRef(false); // Signal to continue playing verses
  const pendingVerseRef = useRef<{ verseIdx: number; content: ChapterContent; voice: string } | null>(null);
  const ttsCache = useRef<Map<string, string>>(new Map()); // Cache for prefetched TTS URLs
  const prefetchingRef = useRef<Set<string>>(new Set()); // Track verses being prefetched
  const playingCommentaryRef = useRef(false); // Track if we're in commentary playback
  const chapterCache = useRef<Map<string, { verse: number; text: string }[]>>(new Map()); // Cache for prefetched chapters
  const commentaryCache = useRef<Map<string, { text: string; audioUrl?: string }>>(new Map()); // Cache for pre-generated commentary
  const prefetchingCommentaryRef = useRef<Set<string>>(new Set()); // Track commentary being prefetched
  const blobUrlsRef = useRef<Set<string>>(new Set()); // Track all created blob URLs for cleanup on unmount
  const browserUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null); // For pause/resume with browser TTS
  const retryCountRef = useRef(0); // Track retry attempts for resilience
  const pausedVerseRef = useRef<{ verseIdx: number; content: ChapterContent; voice: string } | null>(null); // Track paused position
  const keepAliveIntervalRef = useRef<number | null>(null); // Keep speech alive on mobile
  // Use refs to track state for event handlers to avoid stale closures on mobile
  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);
  // Volume refs to ensure audio elements always get current volume (critical for mobile)
  const volumeRef = useRef(volume);
  const isMutedRef = useRef(isMuted);
  
  const isMobile = useIsMobile();

  // Keep refs in sync with state for event handlers (avoids stale closures on mobile)
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    isPausedRef.current = isPaused;
  }, [isPlaying, isPaused]);

  // Media Session API - enables background playback and lock screen controls
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    // Update media metadata when chapter changes
    if (chapterContent && isPlaying) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${chapterContent.book} ${chapterContent.chapter}:${currentVerseIdx + 1}`,
        artist: 'Phototheology Bible Reader',
        album: sequenceName || 'Bible Reading',
      });

      // Set playback state
      navigator.mediaSession.playbackState = isPaused ? 'paused' : 'playing';
    }
  }, [chapterContent, currentVerseIdx, isPlaying, isPaused, sequenceName]);

  // Media Session action handlers - for lock screen / notification controls
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    const handleMediaPlay = () => {
      if (isPaused && mobileAudioEngine.getState() === 'paused') {
        mobileAudioEngine.resume();
        setIsPaused(false);
        setIsPlaying(true);
      } else if (browserUtteranceRef.current) {
        speechSynthesis.resume();
        setIsPaused(false);
      }
    };

    const handleMediaPause = () => {
      if (mobileAudioEngine.isPlaying()) {
        mobileAudioEngine.pause();
        setIsPaused(true);
      } else if (speechSynthesis.speaking) {
        speechSynthesis.pause();
        setIsPaused(true);
      }
    };

    const handleMediaStop = () => {
      mobileAudioEngine.stop();
      speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    };

    // Register handlers
    navigator.mediaSession.setActionHandler('play', handleMediaPlay);
    navigator.mediaSession.setActionHandler('pause', handleMediaPause);
    navigator.mediaSession.setActionHandler('stop', handleMediaStop);

    return () => {
      // Clean up handlers
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('stop', null);
    };
  }, [isPaused]);

  // Keep volume refs in sync
  useEffect(() => {
    volumeRef.current = volume;
    isMutedRef.current = isMuted;
    // Also update any currently playing audio via MobileAudioEngine
    const effectiveVolume = isMuted ? 0 : volume / 100;
    mobileAudioEngine.setVolume(effectiveVolume);
    console.log('[SequencePlayer] Volume ref sync - applied to MobileAudioEngine:', effectiveVolume);
  }, [volume, isMuted]);

  // Resume from saved position
  const handleResume = useCallback(() => {
    if (savedPosition) {
      setCurrentSeqIdx(savedPosition.seqIdx);
      setCurrentItemIdx(savedPosition.itemIdx);
      setCurrentVerseIdx(savedPosition.verseIdx);
      setShowResumeOption(false);
      // Reset chapter content to trigger reload
      setChapterContent(null);
      lastFetchedRef.current = null;
    }
  }, [savedPosition]);

  // Start fresh (clear saved position)
  const handleStartFresh = useCallback(() => {
    setShowResumeOption(false);
    localStorage.removeItem(positionStorageKey);
    setSavedPosition(null);
  }, [positionStorageKey]);

  // Keep audio AND music playing when tab is hidden (background playback)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPlayingRef.current && !isPausedRef.current) {
        console.log('[SequencePlayer] Tab hidden - keeping audio and music alive');
        // Resume speech synthesis if it was paused by the browser
        if (speechSynthesis.paused && browserUtteranceRef.current) {
          speechSynthesis.resume();
        }
        // Ensure audio keeps playing via MobileAudioEngine
        if (mobileAudioEngine.getState() === 'paused') {
          mobileAudioEngine.resume().catch(() => {
            console.log('[SequencePlayer] Could not resume audio in background');
          });
        }
        // Keep background music playing
        if (musicAudioRef.current && musicAudioRef.current.paused && musicVolume > 0) {
          musicAudioRef.current.play().catch(() => {
            console.log('[SequencePlayer] Could not resume music in background');
          });
        }
      } else if (!document.hidden && isPlayingRef.current && !isPausedRef.current) {
        // When returning to foreground, ensure everything is still playing
        console.log('[SequencePlayer] Tab visible - ensuring playback continues');
        if (musicAudioRef.current && musicAudioRef.current.paused && musicVolume > 0) {
          musicAudioRef.current.play().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [musicVolume]);

  // Keep-alive interval for background playback (audio, speech, AND music)
  useEffect(() => {
    const keepAlive = () => {
      if (isPlaying && !isPaused) {
        // Keep speech synthesis alive
        if (speechSynthesis.speaking && speechSynthesis.paused) {
          console.log('[SequencePlayer] Resuming suspended speech');
          speechSynthesis.resume();
        }
        // Keep audio element alive via MobileAudioEngine
        const state = mobileAudioEngine.getState();
        if (state === 'paused' && mobileAudioEngine.getCurrentTime() > 0) {
          console.log('[SequencePlayer] Resuming paused audio');
          mobileAudioEngine.resume().catch(() => {});
        }
        // Keep background music alive
        if (musicAudioRef.current && musicAudioRef.current.paused && musicVolume > 0) {
          console.log('[SequencePlayer] Resuming paused music');
          musicAudioRef.current.play().catch(() => {});
        }
      }
    };

    if (isPlaying && !isPaused) {
      keepAliveIntervalRef.current = window.setInterval(keepAlive, 3000);
    }

    return () => {
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
        keepAliveIntervalRef.current = null;
      }
    };
  }, [isPlaying, isPaused, musicVolume]);

  // Sync playback state with global audio context for mini player
  useEffect(() => {
    if (isPlaying || isPaused) {
      setBibleAudioState({
        isPlaying,
        isPaused,
        sequences,
        currentSeqIdx,
        currentItemIdx,
        currentVerseIdx,
        sequenceName,
      });
      setShowMiniPlayer(true);
    }
  }, [isPlaying, isPaused, currentSeqIdx, currentItemIdx, currentVerseIdx, sequences, sequenceName, setBibleAudioState, setShowMiniPlayer]);

  // Update progress in global context
  useEffect(() => {
    if (isPlaying) {
      updateBibleProgress(currentSeqIdx, currentItemIdx, currentVerseIdx);
    }
  }, [currentSeqIdx, currentItemIdx, currentVerseIdx, isPlaying, updateBibleProgress]);

  // Flatten all items across sequences for navigation
  const allItems = activeSequences.flatMap((seq, seqIdx) =>
    seq.items.map((item) => ({ ...item, seqIdx, voice: currentVoice }))
  );

  const currentItem = allItems[currentItemIdx] || null;
  const currentSequence = activeSequences[currentSeqIdx];
  const totalItems = allItems.length;
  const isActive = isPlaying && !isPaused;

  // Reset refs on mount and clean up on unmount
  useEffect(() => {
    isFetchingChapterRef.current = false;
    lastFetchedRef.current = null;
    isGeneratingRef.current = false;
    shouldPlayNextRef.current = false;
    continuePlayingRef.current = false;
    pendingVerseRef.current = null;
    playingCommentaryRef.current = false;
    ttsCache.current.clear();
    prefetchingRef.current.clear();
    commentaryCache.current.clear();
    prefetchingCommentaryRef.current.clear();
    
    console.log("SequencePlayer mounted, refs reset. Active sequences:", activeSequences.length, "Total items:", totalItems);
    console.log("[Mount] Sequences prop:", sequences.map(s => ({ enabled: s.enabled, itemCount: s.items.length, voice: s.voice })));
    console.log("[Mount] First item:", allItems[0]);
    
    // Cleanup on unmount
    return () => {
      console.log("[SequencePlayer] Unmounting, cleaning up audioPreloader cache");
      audioPreloader.clearCache();
    };
  }, []);

  // Background music is now always available during playback and is controlled solely by the user volume slider.

  // Callback ref for music audio - ensures volume is set when element mounts
  const setMusicAudioRef = useCallback((node: HTMLAudioElement | null) => {
    if (node) {
      musicAudioRef.current = node;
      // Apply current volume immediately
      node.volume = musicVolume / 100;
      console.log('[SequencePlayer] Music audio ref set, volume:', musicVolume / 100);
    }
  }, [musicVolume]);

  // Update music volume directly on ref - critical for mobile
  useEffect(() => {
    if (musicAudioRef.current) {
      const vol = musicVolume / 100;
      musicAudioRef.current.volume = vol;
      console.log('[SequencePlayer] Music volume effect applied:', vol);
    }
  }, [musicVolume]);

  // Start/pause music based on playback
  useEffect(() => {
    if (!musicAudioRef.current) return;

    if (isPlaying && !isPaused && musicVolume > 0) {
      console.log("[Music] Starting background music, volume:", musicVolume);
      musicAudioRef.current.volume = musicVolume / 100;
      musicAudioRef.current.play().catch((err) => {
        console.error("[Music] Failed to start:", err);
      });
    } else {
      musicAudioRef.current.pause();
    }
  }, [isPlaying, isPaused, musicVolume]);

  // Generate chapter commentary using Jeeves (with offline cache)
  // Returns { text, audioUrl } or null
  const generateCommentary = useCallback(async (book: string, chapter: number, chapterText?: string, depth: string = "surface", voice: string = "echo"): Promise<{ text: string; audioUrl?: string } | null> => {
    try {
      // Check offline cache first
      const cached = getCachedChapterCommentary(book, chapter, depth);
      if (cached) {
        console.log("[Commentary] Using cached chapter commentary for", book, chapter);
        return { text: cached };
      }

      // If offline and no cache, return null
      if (!isOnline()) {
        console.log("[Commentary] Offline and no cache for", book, chapter);
        return null;
      }

      console.log("[Commentary] Generating", depth, "chapter commentary for", book, chapter);
      
      // Fetch user's relevant studies to incorporate
      const studiesContext = await fetchRelevantStudies(book, chapter);
      const userStudiesContext = formatStudiesForPrompt(studiesContext);
      
      // Add timeout to edge function call - longer for depth commentary which generates more text
      const timeoutMs = depth === "depth" ? 60000 : depth === "intermediate" ? 40000 : 25000;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      try {
        const { data, error } = await supabase.functions.invoke("generate-chapter-commentary", {
          body: { book, chapter, chapterText, depth, userName, userStudiesContext, generateAudio: true, voice },
        });
        
        clearTimeout(timeoutId);

        if (error) {
          console.error("[Commentary] Edge function error:", error);
          throw error;
        }
        
        const commentary = data?.commentary as string | null;
        const audioUrl = data?.audioUrl as string | undefined;
        
        // Cache the commentary for offline use
        if (commentary) {
          cacheChapterCommentary(book, chapter, depth, commentary);
        }
        
        console.log("[Commentary] Generated chapter commentary length:", commentary?.length || 0, "audioUrl:", !!audioUrl);
        return commentary ? { text: commentary, audioUrl } : null;
      } catch (invokeError) {
        clearTimeout(timeoutId);
        throw invokeError;
      }
    } catch (e) {
      console.error("[Commentary] Error generating chapter commentary:", e);
      return null;
    }
  }, [fetchRelevantStudies, formatStudiesForPrompt, userName]);

  // Generate verse commentary using Jeeves (with offline cache AND database cache)
  const generateVerseCommentary = useCallback(async (book: string, chapter: number, verse: number, verseText: string, depth: string = "surface") => {
    try {
      // Check offline cache first
      const offlineCached = getCachedVerseCommentary(book, chapter, verse, depth);
      if (offlineCached) {
        console.log("[Verse Commentary] Using offline cached commentary for", book, chapter + ":" + verse);
        return offlineCached;
      }

      // Check database cache (pre-generated)
      const { data: dbCached, error: cacheError } = await supabase
        .from('verse_commentary_cache')
        .select('commentary_text')
        .eq('book', book)
        .eq('chapter', chapter)
        .eq('verse', verse)
        .eq('depth', depth)
        .maybeSingle();

      if (!cacheError && dbCached?.commentary_text) {
        console.log("[Verse Commentary] Using pre-generated database cache for", book, chapter + ":" + verse);
        // Also cache offline for next time
        cacheVerseCommentary(book, chapter, verse, depth, dbCached.commentary_text);
        return dbCached.commentary_text;
      }

      // If offline and no cache, return null
      if (!isOnline()) {
        console.log("[Verse Commentary] Offline and no cache for", book, chapter + ":" + verse);
        return null;
      }

      console.log("[Verse Commentary] Generating", depth, "commentary for", book, chapter + ":" + verse);
      
      // Fetch user's relevant studies to incorporate
      const studiesContext = await fetchRelevantStudies(book, chapter, verse);
      const userStudiesContext = formatStudiesForPrompt(studiesContext);
      
      // Add timeout to edge function call - longer for deep-drill
      const timeoutMs = depth === "deep-drill" ? 30000 : 15000; // 30s for deep-drill, 15s for others
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      try {
        const { data, error } = await supabase.functions.invoke("generate-verse-commentary", {
          body: { book, chapter, verse, verseText, depth, userName, userStudiesContext },
        });
        
        clearTimeout(timeoutId);

        if (error) {
          console.error("[Verse Commentary] Edge function error:", error);
          throw error;
        }
        
        const commentary = data?.commentary as string | null;
        
        // Cache the commentary for offline use
        if (commentary) {
          cacheVerseCommentary(book, chapter, verse, depth, commentary);
          
          // Also cache in database for future use (fire and forget)
          (async () => {
            try {
              await supabase
                .from('verse_commentary_cache')
                .insert({
                  book,
                  chapter,
                  verse,
                  commentary_text: commentary,
                  depth,
                });
              console.log("[Verse Commentary] Cached in database");
            } catch (err) {
              console.error("[Verse Commentary] Failed to cache in DB:", err);
            }
          })();
        }
        
        console.log("[Verse Commentary] Generated length:", commentary?.length || 0);
        return commentary;
      } catch (invokeError) {
        clearTimeout(timeoutId);
        throw invokeError;
      }
    } catch (e) {
      console.error("[Verse Commentary] Error:", e);
      return null;
    }
  }, [userName, fetchRelevantStudies, formatStudiesForPrompt]);

  // Move to next chapter
  const moveToNextChapter = useCallback(() => {
    console.log("[Audio] moveToNextChapter called");
    shouldPlayNextRef.current = true;
    setCurrentItemIdx((prev) => {
      const nextIdx = prev + 1;
      if (nextIdx >= totalItems) {
        console.log("[Audio] All chapters complete!");
        setIsPlaying(false);
        continuePlayingRef.current = false;
        toast.success("Reading sequence complete!");
        return prev;
      }
      console.log("[Audio] Moving to chapter:", nextIdx + 1, "of", totalItems);
      setCurrentVerseIdx(0);
      // Clear completed verses for new chapter
      setCompletedVerseIndices(new Set());
      setCurrentCommentaryVerse(null);
      // Clear chapter content to trigger reload
      setChapterContent(null);
      // Reset lastFetchedRef so the new chapter can load
      lastFetchedRef.current = "";
      return nextIdx;
    });
  }, [totalItems]);


  // Fetch chapter content (with caching) - MOBILE-OPTIMIZED with aggressive timeouts
  const fetchChapter = useCallback(async (book: string, chapter: number) => {
    const cacheKey = `${book}-${chapter}`;

    // Check cache first
    if (chapterCache.current.has(cacheKey)) {
      console.log("[Chapter] Using cached:", cacheKey);
      return chapterCache.current.get(cacheKey)!;
    }

    // MOBILE: Use shorter timeout (10s instead of 15s) to fail faster
    const timeoutMs = isMobile ? 10000 : 15000;

    try {
      console.log("[Chapter] Fetching from API:", cacheKey, "timeout:", timeoutMs, "ms");

      const invokePromise = supabase.functions.invoke("bible-api", {
        body: { book, chapter, version: "kjv" },
      });

      const result = await Promise.race([
        invokePromise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Chapter fetch timeout")), timeoutMs)
        ),
      ]);

      const { data, error } = result as Awaited<typeof invokePromise>;

      console.log("[Chapter] API Response:", {
        hasData: !!data,
        hasError: !!error,
        versesCount: data?.verses?.length,
      });

      if (error) {
        console.error("[Chapter] API Error:", error);
        throw error;
      }

      if (!data || !Array.isArray(data.verses) || data.verses.length === 0) {
        console.error("[Chapter] No verses in response:", data);
        throw new Error("No verses in response");
      }

      const verses = data.verses as { verse: number; text: string }[];
      console.log("[Chapter] Successfully loaded", verses.length, "verses");
      chapterCache.current.set(cacheKey, verses);
      return verses;
    } catch (e: any) {
      console.error("[Chapter] Error fetching:", e);
      const msg = String(e?.message || "");
      if (msg.toLowerCase().includes("timeout")) {
        console.error("[Chapter] TIMEOUT - mobile:", isMobile);
        toast.error(`Connection timeout. Tap Retry to load ${book} ${chapter}.`, { duration: 5000 });
      } else {
        toast.error(`Failed to load ${book} ${chapter}. Check your connection.`, { duration: 5000 });
      }
      return null;
    }
  }, [isMobile]);

  // Prefetch next chapter in background
  const prefetchNextChapter = useCallback((currentIdx: number) => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= allItems.length) return;
    
    const nextItem = allItems[nextIdx];
    if (!nextItem) return;
    
    const cacheKey = `${nextItem.book}-${nextItem.chapter}`;
    if (chapterCache.current.has(cacheKey)) return;
    
    console.log("[Prefetch] Starting chapter prefetch:", cacheKey);
    fetchChapter(nextItem.book, nextItem.chapter);
  }, [allItems, fetchChapter]);

  // Determine TTS provider from voice name
  const getProviderForVoice = useCallback((voice: string): 'openai' | 'elevenlabs' | 'speechify' => {
    // ElevenLabs voices
    const elevenlabsVoices = ['george', 'aria', 'roger', 'sarah', 'charlie', 'callum', 'river', 'liam', 'charlotte', 'alice', 'matilda', 'will', 'jessica', 'eric', 'chris', 'brian', 'daniel', 'lily', 'bill'];
    // Speechify voices
    const speechifyVoices = ['henry', 'mrbeast', 'cliff', 'cody', 'kristy', 'natasha', 'cindy'];
    // OpenAI voices (supported set)
    const openaiVoices = ['alloy', 'ash', 'coral', 'echo', 'fable', 'nova', 'onyx', 'sage', 'shimmer'];
    
    const voiceLower = voice.toLowerCase();
    if (elevenlabsVoices.includes(voiceLower)) return 'elevenlabs';
    if (speechifyVoices.includes(voiceLower)) return 'speechify';
    if (openaiVoices.includes(voiceLower)) return 'openai';
    
    // Default to elevenlabs for premium experience
    return 'elevenlabs';
  }, []);

  // Generate TTS for text - with offline fallback and optional server-side caching
  const generateTTS = useCallback(async (
    text: string, 
    voice: string,
    verseInfo?: { book: string; chapter: number; verse: number }
  ): Promise<string | null> => {
    // If offline mode, use browser speech synthesis
    if (offlineMode || !isOnline()) {
      console.log("[TTS] Using offline browser speech synthesis");
      return null; // Signal to use speech synthesis
    }
    
    // Auto-detect provider from voice name
    const provider = getProviderForVoice(voice);
    console.log(`[TTS] Using provider: ${provider} for voice: ${voice}`);
    
    try {
      // Build request body - include verse info for server-side caching when available
      const requestBody: Record<string, unknown> = { text, voice, provider };
      if (verseInfo) {
        requestBody.book = verseInfo.book;
        requestBody.chapter = verseInfo.chapter;
        requestBody.verse = verseInfo.verse;
        requestBody.useCache = true;
      }
      
      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: requestBody,
      });

      if (error) throw error;

      // Handle URL response (cached or just-cached)
      if (data?.audioUrl) {
        console.log("[TTS] Using returned audio URL, cached:", data.cached);
        return data.audioUrl;
      }

      // Handle base64 response
      if (data?.audioContent) {
        const byteCharacters = atob(data.audioContent);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "audio/mpeg" });
        const blobUrl = URL.createObjectURL(blob);
        // Track blob URL for cleanup on unmount
        blobUrlsRef.current.add(blobUrl);
        return blobUrl;
      }
      console.warn("[TTS] No audio content in response");
      return null;
    } catch (e) {
      console.error("Error generating TTS:", e);
      // Fallback to offline mode if API fails
      return null;
    }
  }, [offlineMode, getProviderForVoice]);

  // Browser speech synthesis for offline mode - with pause/resume support and chunking
  const speakWithBrowserTTS = useCallback((text: string, playbackSpeed: number, onEnd: () => void): void => {
    speechSynthesis.cancel();
    
    // Split long texts into chunks to prevent timeout
    const MAX_CHUNK_LENGTH = 200;
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > MAX_CHUNK_LENGTH && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }
    if (currentChunk) chunks.push(currentChunk.trim());

    console.log(`[SequencePlayer] Split into ${chunks.length} chunks, playback speed:`, playbackSpeed);

    let currentChunkIndex = 0;

    const speakChunk = () => {
      if (currentChunkIndex >= chunks.length) {
        browserUtteranceRef.current = null;
        onEnd();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[currentChunkIndex]);
      utterance.rate = playbackSpeed;
      utterance.pitch = 1;
      
      const voices = speechSynthesis.getVoices();
      const englishVoice = voices.find(v => 
        v.lang.startsWith('en') && 
        (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Daniel'))
      ) || voices.find(v => v.lang.startsWith('en'));
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      utterance.onend = () => {
        currentChunkIndex++;
        setTimeout(speakChunk, 100);
      };
      
      utterance.onerror = (e) => {
        console.error("[BrowserTTS] Error on chunk:", currentChunkIndex, e);
        if (e.error !== 'interrupted') {
          currentChunkIndex++;
          if (currentChunkIndex < chunks.length) {
            setTimeout(speakChunk, 500);
          } else {
            browserUtteranceRef.current = null;
            onEnd();
          }
        }
      };
      
      browserUtteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    };

    speakChunk();
  }, []);

  // Play commentary audio
  const playCommentary = useCallback(async (text: string, voice: string, onComplete: () => void) => {
    console.log("[Commentary] Playing commentary, length:", text.length);
    setIsPlayingCommentary(true);
    setCommentaryText(text);
    playingCommentaryRef.current = true;
    setIsLoading(true);

    // For very long commentary, use browser TTS directly to avoid timeout issues on mobile
    const MAX_API_TTS_LENGTH = 4000; // OpenAI's limit is 4096 chars
    const useBrowserTTS = offlineMode || !isOnline() || text.length > MAX_API_TTS_LENGTH * 2;
    
    if (useBrowserTTS) {
      console.log("[Commentary] Using browser TTS for long commentary or offline mode");
      setIsLoading(false);
      const playbackSpeed = currentSequence?.playbackSpeed || 1;
      notifyTTSStarted();
      speakWithBrowserTTS(text, playbackSpeed, () => {
        notifyTTSStopped();
        setIsPlayingCommentary(false);
        playingCommentaryRef.current = false;
        setCommentaryText(null);
        onComplete();
      });
      return;
    }

    // Add timeout to TTS generation - reasonable limit to prevent long hangs
    const timeoutMs = 45000; // 45 seconds max for TTS generation (reduced from 120 to prevent long pauses)
    const timeoutPromise = new Promise<string | null>((_, reject) =>
      setTimeout(() => reject(new Error('TTS generation timeout')), timeoutMs)
    );

    let url: string | null = null;
    
    try {
      url = await Promise.race([
        generateTTS(text, voice),
        timeoutPromise
      ]);
    } catch (error) {
      console.error("[Commentary] TTS generation failed or timed out, falling back to browser TTS:", error);
      setIsLoading(false);
      
      // Fallback to browser TTS for commentary
      const playbackSpeed = currentSequence?.playbackSpeed || 1;
      notifyTTSStarted();
      speakWithBrowserTTS(text, playbackSpeed, () => {
        notifyTTSStopped();
        setIsPlayingCommentary(false);
        playingCommentaryRef.current = false;
        setCommentaryText(null);
        onComplete();
      });
      return;
    }
    
    setIsLoading(false);

    if (!url) {
      console.error("[Commentary] Failed to generate TTS");
      setIsPlayingCommentary(false);
      playingCommentaryRef.current = false;
      setCommentaryText(null);
      toast.error("Commentary audio unavailable, continuing", { duration: 2000 });
      onComplete();
      return;
    }

    // Stop any existing audio using persistent element
    stopAudio();
    setAudioUrl(url);
    
    const playbackSpeed = currentSequence?.playbackSpeed || 1;
    
    // Use the persistent audio element (iOS-safe)
    const playSuccess = await playAudioUrl(url, {
      volume: isMutedRef.current ? 0 : volumeRef.current / 100,
      playbackRate: playbackSpeed,
      onEnded: () => {
        console.log("[Commentary] Finished playing");
        setIsPlayingCommentary(false);
        playingCommentaryRef.current = false;
        setCommentaryText(null);
        // Don't revoke blob URL here - it may be cached. Clean up on unmount only.
        onComplete();
      },
      onError: (e) => {
        console.error("[Commentary] Audio error:", e);
        setIsPlayingCommentary(false);
        playingCommentaryRef.current = false;
        setCommentaryText(null);
        toast.error("Commentary playback error, continuing", { duration: 2000 });
        onComplete();
      }
    });
    
    if (!playSuccess) {
      console.warn("[Commentary] Play blocked, user may need to interact first");
      // With persistent audio, this should be rare after initial unlock
      toast.info('Tap anywhere to start commentary audio');
    }
  }, [generateTTS, isMuted, volume, currentSequence]);

  // Handle chapter completion with commentary check (for browser TTS and fallback paths)
  const handleChapterCompleteWithCommentary = useCallback((content: ChapterContent) => {
    // Find current sequence to check commentary settings
    const currentSeq = activeSequences.find((seq, idx) => {
      const itemsBefore = activeSequences.slice(0, idx).reduce((acc, s) => acc + s.items.length, 0);
      return currentItemIdx >= itemsBefore && currentItemIdx < itemsBefore + seq.items.length;
    });
    
    const includeCommentary = currentSeq?.includeJeevesCommentary || false;
    const commentaryMode = currentSeq?.commentaryMode || "chapter";
    const commentaryVoice = currentSeq?.commentaryVoice || "daniel";
    // Use the session-level commentary depth (can be changed mid-session)
    const commentaryDepth = currentCommentaryDepth;
    
    console.log("[ChapterComplete] Commentary settings:", { includeCommentary, commentaryMode });
    
    if (includeCommentary && commentaryMode === "chapter" && content && continuePlayingRef.current) {
      const cacheKey = `chapter-${content.book}-${content.chapter}-${commentaryVoice}`;
      const cached = commentaryCache.current.get(cacheKey);
      
      if (cached?.audioUrl) {
        console.log("[ChapterComplete] Using cached chapter commentary audio");
        setCommentaryText(cached.text);
        setIsPlayingCommentary(true);
        playingCommentaryRef.current = true;
        
        const playbackSpeed = currentSeq?.playbackSpeed || 1;
        
        playAudioUrl(cached.audioUrl, {
          volume: isMutedRef.current ? 0 : volumeRef.current / 100,
          playbackRate: playbackSpeed,
          onEnded: () => {
            console.log("[ChapterComplete] Audio ended");
            setIsPlayingCommentary(false);
            playingCommentaryRef.current = false;
            setCommentaryText(null);
            moveToNextChapter();
          },
          onError: () => {
            setIsPlayingCommentary(false);
            playingCommentaryRef.current = false;
            setCommentaryText(null);
            moveToNextChapter();
          }
        }).then(success => {
          if (!success) {
            console.warn("[ChapterComplete] Play blocked, waiting for interaction");
            toast.info("Tap to continue audio", { duration: 3000 });
          }
        });
      } else if (cached?.text) {
        console.log("[ChapterComplete] Using cached chapter commentary text");
        playCommentary(cached.text, commentaryVoice, moveToNextChapter);
      } else {
        // Generate commentary
        console.log("[ChapterComplete] Generating chapter commentary");
        setIsLoading(true);
        const chapterText = content.verses.map(v => `${v.verse}. ${v.text}`).join(" ");
        
        generateCommentary(content.book, content.chapter, chapterText, commentaryDepth, commentaryVoice)
          .then(result => {
            if (result?.text && continuePlayingRef.current) {
              // If we got a cached audio URL, use it directly
              if (result.audioUrl) {
                commentaryCache.current.set(`chapter-${content.book}-${content.chapter}-${commentaryVoice}`, { text: result.text, audioUrl: result.audioUrl });
                setCommentaryText(result.text);
                setIsPlayingCommentary(true);
                playingCommentaryRef.current = true;
                setIsLoading(false);
                
                playAudioUrl(result.audioUrl, {
                  volume: isMutedRef.current ? 0 : volumeRef.current / 100,
                  onEnded: () => {
                    setIsPlayingCommentary(false);
                    playingCommentaryRef.current = false;
                    setCommentaryText(null);
                    moveToNextChapter();
                  },
                  onError: () => {
                    setIsPlayingCommentary(false);
                    playingCommentaryRef.current = false;
                    setCommentaryText(null);
                    moveToNextChapter();
                  }
                }).catch(() => moveToNextChapter());
              } else {
                playCommentary(result.text, commentaryVoice, moveToNextChapter);
              }
            } else {
              setIsLoading(false);
              moveToNextChapter();
            }
          })
          .catch(() => {
            setIsLoading(false);
            moveToNextChapter();
          });
      }
    } else {
      console.log("[ChapterComplete] No commentary, moving to next chapter");
      moveToNextChapter();
    }
  }, [activeSequences, currentItemIdx, isMuted, volume, generateCommentary, playCommentary, moveToNextChapter]);

  // Prefetch TTS for upcoming verses
  const prefetchVerse = useCallback(async (verseIdx: number, content: ChapterContent, voice: string) => {
    if (!content?.verses || verseIdx >= content.verses.length) return;
    
    const cacheKey = `${content.book}-${content.chapter}-${verseIdx}-${voice}`;
    
    // Skip if already cached or being prefetched
    if (ttsCache.current.has(cacheKey) || prefetchingRef.current.has(cacheKey)) {
      return;
    }
    
    prefetchingRef.current.add(cacheKey);
    console.log("[Prefetch] Starting for verse:", verseIdx + 1);
    
    const verse = content.verses[verseIdx];
    // Pass verse info for server-side caching
    const url = await generateTTS(verse.text, voice, {
      book: content.book,
      chapter: content.chapter,
      verse: verse.verse
    });
    
    prefetchingRef.current.delete(cacheKey);
    
    if (url) {
      ttsCache.current.set(cacheKey, url);
      console.log("[Prefetch] Cached verse:", verseIdx + 1);
    }
  }, [generateTTS]);

  // Prefetch verse commentary (text + TTS) while verse is playing
  const prefetchVerseCommentary = useCallback(async (
    book: string,
    chapter: number,
    verse: number,
    verseText: string,
    commentaryVoice: string,
    depth: string = "surface"
  ) => {
    const cacheKey = `verse-${book}-${chapter}-${verse}-${commentaryVoice}`;

    // Skip if already cached or being prefetched
    if (commentaryCache.current.has(cacheKey) || prefetchingCommentaryRef.current.has(cacheKey)) {
      return;
    }

    // Check offline audio cache first
    const offlineCachedAudio = await getCachedVerseCommentaryAudio(book, chapter, verse, depth, commentaryVoice);
    if (offlineCachedAudio) {
      // Also check if we have the text cached (text cache doesn't include voice)
      const cachedText = getCachedVerseCommentary(book, chapter, verse, depth);
      if (cachedText) {
        commentaryCache.current.set(cacheKey, { text: cachedText, audioUrl: offlineCachedAudio });
        console.log("[Prefetch Commentary] Using OFFLINE cached audio for", book, chapter + ":" + verse);
        return;
      }
    }

    prefetchingCommentaryRef.current.add(cacheKey);
    console.log("[Prefetch Commentary] Starting for", book, chapter + ":" + verse);

    try {
      // Generate commentary text
      const commentary = await generateVerseCommentary(book, chapter, verse, verseText, depth);

      if (commentary) {
        // Generate TTS for commentary
        const audioUrl = await generateTTS(commentary, commentaryVoice);
        commentaryCache.current.set(cacheKey, { text: commentary, audioUrl: audioUrl || undefined });
        console.log("[Prefetch Commentary] Cached for", book, chapter + ":" + verse);

        // Cache audio blob for offline use
        if (audioUrl) {
          try {
            const response = await fetch(audioUrl);
            if (response.ok) {
              const blob = await response.blob();
              await cacheVerseCommentaryAudio(book, chapter, verse, depth, commentaryVoice, blob);
              console.log("[Prefetch Commentary] Cached audio OFFLINE for", book, chapter + ":" + verse);
            }
          } catch (e) {
            console.warn("[Prefetch Commentary] Failed to cache audio offline:", e);
          }
        }
      }
    } catch (e) {
      console.error("[Prefetch Commentary] Error:", e);
    } finally {
      prefetchingCommentaryRef.current.delete(cacheKey);
    }
  }, [generateVerseCommentary, generateTTS]);

  // Prefetch chapter commentary while chapter is playing
  const prefetchChapterCommentary = useCallback(async (
    book: string,
    chapter: number,
    chapterText: string,
    commentaryVoice: string,
    depth: string = "surface"
  ) => {
    const cacheKey = `chapter-${book}-${chapter}-${commentaryVoice}`;

    if (commentaryCache.current.has(cacheKey) || prefetchingCommentaryRef.current.has(cacheKey)) {
      return;
    }

    // Check offline audio cache first
    const offlineCachedAudio = await getCachedCommentaryAudio(book, chapter, depth, commentaryVoice);
    if (offlineCachedAudio) {
      // Also check if we have the text cached (text cache doesn't include voice)
      const cachedText = getCachedChapterCommentary(book, chapter, depth);
      if (cachedText) {
        commentaryCache.current.set(cacheKey, { text: cachedText, audioUrl: offlineCachedAudio });
        console.log("[Prefetch Chapter Commentary] Using OFFLINE cached audio for", book, chapter);
        return;
      }
    }

    prefetchingCommentaryRef.current.add(cacheKey);
    console.log("[Prefetch Chapter Commentary] Starting for", book, chapter);

    try {
      const result = await generateCommentary(book, chapter, chapterText, depth, commentaryVoice);

      if (result?.text) {
        // If audioUrl came from server cache, use it; otherwise generate TTS
        const audioUrl = result.audioUrl || await generateTTS(result.text, commentaryVoice);
        commentaryCache.current.set(cacheKey, { text: result.text, audioUrl: audioUrl || undefined });
        console.log("[Prefetch Chapter Commentary] Cached for", book, chapter, "hasAudioUrl:", !!result.audioUrl);

        // Cache audio blob for offline use
        if (audioUrl) {
          try {
            const response = await fetch(audioUrl);
            if (response.ok) {
              const blob = await response.blob();
              await cacheCommentaryAudio(book, chapter, depth, commentaryVoice, blob);
              console.log("[Prefetch Chapter Commentary] Cached audio OFFLINE for", book, chapter);
            }
          } catch (e) {
            console.warn("[Prefetch Chapter Commentary] Failed to cache audio offline:", e);
          }
        }
      }
    } catch (e) {
      console.error("[Prefetch Chapter Commentary] Error:", e);
    } finally {
      prefetchingCommentaryRef.current.delete(cacheKey);
    }
  }, [generateCommentary, generateTTS]);

  // AGGRESSIVE PRELOADING: Prefetch ALL verse commentary for entire chapter in background
  // This runs when playback starts, ensuring commentary is ready before each verse
  const prefetchAllChapterVerseCommentary = useCallback(async (
    content: ChapterContent,
    commentaryVoice: string,
    depth: string = "surface",
    startFromVerse: number = 0
  ) => {
    if (!content?.verses?.length) return;

    console.log(`[Prefetch ALL] Starting background preload for ${content.book} ${content.chapter} (${content.verses.length} verses, starting from ${startFromVerse + 1})`);

    // Stagger requests to avoid overwhelming the API - process in batches of 3
    const BATCH_SIZE = 3;
    const BATCH_DELAY = 1000; // 1 second between batches

    for (let i = startFromVerse; i < content.verses.length; i += BATCH_SIZE) {
      const batch = content.verses.slice(i, Math.min(i + BATCH_SIZE, content.verses.length));

      // Fire off batch in parallel
      const batchPromises = batch.map(verse =>
        prefetchVerseCommentary(
          content.book,
          content.chapter,
          verse.verse,
          verse.text,
          commentaryVoice,
          depth
        )
      );

      // Wait for batch to complete before starting next
      await Promise.allSettled(batchPromises);

      // Small delay between batches to be gentle on the API
      if (i + BATCH_SIZE < content.verses.length) {
        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
      }
    }

    console.log(`[Prefetch ALL] Completed background preload for ${content.book} ${content.chapter}`);
  }, [prefetchVerseCommentary]);

  // Play commentary for a single verse (commentary-only mode)
  // NOTE: This must be defined BEFORE playCommentaryOnlyChapter to avoid temporal dead zone
  const playCommentaryOnlyVerse = useCallback(async (verseIdx: number, content: ChapterContent, sequence: ReadingSequenceBlock) => {
    if (verseIdx >= content.verses.length) {
      // All verses done, move to next chapter
      if (continuePlayingRef.current) {
        moveToNextChapter();
      } else {
        setIsPlaying(false);
      }
      return;
    }
    
    const verse = content.verses[verseIdx];
    const commentaryVoice = sequence.commentaryVoice || "daniel";
    // Use the session-level commentary depth (can be changed mid-session)
    const commentaryDepth = currentCommentaryDepth;
    
    console.log("[Commentary Only] Playing verse", verseIdx + 1, "commentary");
    setCurrentVerseIdx(verseIdx);
    
    try {
      const commentary = await generateVerseCommentary(content.book, content.chapter, verse.verse, verse.text, commentaryDepth);
      
      if (commentary && continuePlayingRef.current) {
        playCommentary(commentary, commentaryVoice, () => {
          // Move to next verse commentary
          if (continuePlayingRef.current) {
            playCommentaryOnlyVerse(verseIdx + 1, content, sequence);
          } else {
            setIsPlaying(false);
          }
        });
      } else {
        // No commentary or stopped, skip to next verse or stop
        if (continuePlayingRef.current) {
          playCommentaryOnlyVerse(verseIdx + 1, content, sequence);
        } else {
          setIsPlaying(false);
        }
      }
    } catch (error) {
      console.error("[Commentary Only] Error generating verse commentary:", error);
      // Try to continue with next verse
      if (continuePlayingRef.current) {
        playCommentaryOnlyVerse(verseIdx + 1, content, sequence);
      } else {
        setIsPlaying(false);
      }
    }
  }, [generateVerseCommentary, playCommentary, moveToNextChapter, currentCommentaryDepth]);

  // Play commentary only (skip verse reading)
  const playCommentaryOnlyChapter = useCallback(async (content: ChapterContent, sequence: ReadingSequenceBlock) => {
    if (!content || !sequence.includeJeevesCommentary) return;
    
    console.log("[Commentary Only] Starting commentary-only playback");
    setIsLoading(true);
    setIsPlaying(true);
    setIsPaused(false);
    // Don't duck music in commentary-only mode - let it play alongside
    if (!sequence.commentaryOnly) {
      notifyTTSStarted();
    }
    
    const commentaryMode = sequence.commentaryMode || "chapter";
    const commentaryVoice = sequence.commentaryVoice || "daniel";
    // Use the session-level commentary depth (can be changed mid-session)
    const commentaryDepth = currentCommentaryDepth;
    
    try {
      if (commentaryMode === "chapter") {
        // Play chapter commentary
        const chapterText = content.verses.map(v => `${v.verse}. ${v.text}`).join(" ");
        const result = await generateCommentary(content.book, content.chapter, chapterText, commentaryDepth, commentaryVoice);
        
        setIsLoading(false);
        
        if (result?.text && continuePlayingRef.current) {
          // Use cached audio URL if available
          if (result.audioUrl) {
            setCommentaryText(result.text);
            setIsPlayingCommentary(true);
            playingCommentaryRef.current = true;
            
            playAudioUrl(result.audioUrl, {
              volume: isMutedRef.current ? 0 : volumeRef.current / 100,
              onEnded: () => {
                setIsPlayingCommentary(false);
                playingCommentaryRef.current = false;
                setCommentaryText(null);
                if (continuePlayingRef.current) {
                  moveToNextChapter();
                } else {
                  setIsPlaying(false);
                }
              },
              onError: () => {
                setIsPlayingCommentary(false);
                playingCommentaryRef.current = false;
                setCommentaryText(null);
                moveToNextChapter();
              }
            }).catch(() => moveToNextChapter());
          } else {
            playCommentary(result.text, commentaryVoice, () => {
              // Move to next chapter after commentary
              if (continuePlayingRef.current) {
                moveToNextChapter();
              } else {
                setIsPlaying(false);
              }
            });
          }
        } else {
          // No commentary available or stopped, clean up and move to next
          if (continuePlayingRef.current) {
            moveToNextChapter();
          } else {
            setIsPlaying(false);
          }
        }
      } else {
        // Play verse-by-verse commentary
        setIsLoading(false);
        playCommentaryOnlyVerse(0, content, sequence);
      }
    } catch (error) {
      console.error("[Commentary Only] Error generating commentary:", error);
      setIsLoading(false);
      setIsPlaying(false);
      toast.error("Failed to generate commentary");
    }
  }, [generateCommentary, playCommentary, moveToNextChapter, playCommentaryOnlyVerse, currentCommentaryDepth]);

  // Play a specific verse by index - using a stable ref to avoid stale closures
  const playVerseAtIndex = useCallback(async (verseIdx: number, content: ChapterContent, voice: string) => {
    console.log("[PlayVerse] Called with:", { verseIdx, versesCount: content?.verses?.length, voice, offlineMode });

    // CRITICAL: Multiple guards to prevent duplicate playback calls
    // This fixes bug where verse plays 3x due to useEffect re-running
    if (isSettingUpPlaybackRef.current) {
      console.log("[PlayVerse] Already setting up playback, skipping duplicate call for verse:", verseIdx + 1);
      return;
    }
    if (isGeneratingRef.current) {
      console.log("[PlayVerse] Already generating TTS, skipping verse:", verseIdx + 1);
      return;
    }
    // Validate content before proceeding
    if (!content || !content.verses || verseIdx >= content.verses.length) {
      console.log("[PlayVerse] Invalid verse index or content:", { hasContent: !!content, verseIdx });
      return;
    }

    // Set the setup flag immediately to prevent race conditions
    isSettingUpPlaybackRef.current = true;
    
    // Stop any existing audio BEFORE proceeding (moved earlier to prevent race conditions)
    // This ensures we can always start fresh playback - stop BOTH audio systems
    if (mobileAudioEngine.isPlaying() || mobileAudioEngine.getState() === 'loading') {
      console.log("[PlayVerse] Stopping existing audio before verse:", verseIdx + 1);
      mobileAudioEngine.stop();
    }
    // CRITICAL: Also stop browser TTS to prevent overlapping voices
    if (speechSynthesis.speaking) {
      console.log("[PlayVerse] Stopping browser TTS before verse:", verseIdx + 1);
      speechSynthesis.cancel();
    }

    const verse = content.verses[verseIdx];
    const cacheKey = `${content.book}-${content.chapter}-${verseIdx}-${voice}`;

    setCurrentVerseIdx(verseIdx);

    // Save reading position for "resume" feature
    saveCurrentPosition(currentSeqIdx, currentItemIdx, verseIdx);

    // Find current sequence for settings (needed early for offline mode)
    const currentSeq = activeSequences.find((seq, idx) => {
      const itemsBefore = activeSequences.slice(0, idx).reduce((acc, s) => acc + s.items.length, 0);
      return currentItemIdx >= itemsBefore && currentItemIdx < itemsBefore + seq.items.length;
    });
    
    // CRITICAL OPTIMIZATION: Start commentary prefetch IMMEDIATELY (before verse TTS)
    // This runs commentary generation IN PARALLEL with verse TTS generation,
    // using the ~2-5 second verse generation time to prepare commentary
    const includeCommentaryEarly = currentSeq?.includeJeevesCommentary || false;
    const commentaryModeEarly = currentSeq?.commentaryMode || "chapter";
    const commentaryVoiceEarly = currentSeq?.commentaryVoice || "daniel";
    
    if (includeCommentaryEarly && commentaryModeEarly === "verse" && !offlineMode) {
      // Start prefetching current verse commentary IMMEDIATELY (fire and forget)
      prefetchVerseCommentary(content.book, content.chapter, verse.verse, verse.text, commentaryVoiceEarly, currentCommentaryDepth);
      
      // Also prefetch next verse's commentary in parallel
      const nextVerseIdx = verseIdx + 1;
      if (nextVerseIdx < content.verses.length) {
        const nextVerse = content.verses[nextVerseIdx];
        prefetchVerseCommentary(content.book, content.chapter, nextVerse.verse, nextVerse.text, commentaryVoiceEarly, currentCommentaryDepth);
      }
      
      // Prefetch 2 verses ahead with slight delay
      const nextNextVerseIdx = verseIdx + 2;
      if (nextNextVerseIdx < content.verses.length) {
        const nextNextVerse = content.verses[nextNextVerseIdx];
        setTimeout(() => {
          prefetchVerseCommentary(content.book, content.chapter, nextNextVerse.verse, nextNextVerse.text, commentaryVoiceEarly, currentCommentaryDepth);
        }, 300);
      }
    }
    const playbackSpeed = currentSeq?.playbackSpeed || 1;

    // Check offline cache first (persists across sessions)
    let url = await getCachedTTSAudio(content.book, content.chapter, verse.verse, voice);

    if (url) {
      console.log("[PlayVerse] Using OFFLINE cached TTS for verse:", verseIdx + 1);
    } else if (!offlineMode) {
      // Check in-memory cache next
      url = ttsCache.current.get(cacheKey) || null;

      if (url) {
        console.log("[PlayVerse] Using in-memory cached TTS for verse:", verseIdx + 1);
      } else if (isOnline()) {
        // Generate TTS via API (online mode) - pass verse info for server-side caching
        isGeneratingRef.current = true;
        console.log("[PlayVerse] Generating TTS for verse:", verseIdx + 1, "text:", verse.text.substring(0, 50));
        setIsLoading(true);

        url = await generateTTS(verse.text, voice, {
          book: content.book,
          chapter: content.chapter,
          verse: verse.verse
        });

        isGeneratingRef.current = false;
        setIsLoading(false);

        if (url) {
          ttsCache.current.set(cacheKey, url);
          // Server-side caching now handles storage, no need for client-side blob caching
          // This dramatically speeds up verse-to-verse transitions
        }
      }
    }
    
    // OFFLINE MODE: Use browser speech synthesis
    if (!url && (offlineMode || !isOnline())) {
      console.log("[PlayVerse] Using browser speech synthesis (offline mode)");
      isSettingUpPlaybackRef.current = false; // Clear setup flag - switching to browser TTS
      notifyTTSStarted();

      speakWithBrowserTTS(verse.text, playbackSpeed, () => {
        // On speech end, continue to next verse or chapter
        if (continuePlayingRef.current && verseIdx < content.verses.length - 1) {
          setTimeout(() => {
            if (continuePlayingRef.current) {
              playVerseAtIndex(verseIdx + 1, content, voice);
            }
          }, 300);
        } else if (verseIdx >= content.verses.length - 1) {
          notifyTTSStopped();
          handleChapterCompleteWithCommentary(content);
        }
      });
      return;
    }

    console.log("[PlayVerse] TTS result:", url ? "URL ready" : "FAILED");

    if (!url) {
      console.error("[PlayVerse] Failed to generate TTS URL - falling back to browser TTS");
      isSettingUpPlaybackRef.current = false; // Clear setup flag - switching to browser TTS
      // Fallback to browser TTS even if online mode failed
      speakWithBrowserTTS(verse.text, playbackSpeed, () => {
        if (continuePlayingRef.current && verseIdx < content.verses.length - 1) {
          setTimeout(() => playVerseAtIndex(verseIdx + 1, content, voice), 300);
        } else if (verseIdx >= content.verses.length - 1) {
          handleChapterCompleteWithCommentary(content);
        }
      });
      return;
    }

    // Prefetch next 5 verses while this one plays - aggressive prefetch for smooth playback
    for (let i = 1; i <= 5; i++) {
      const nextIdx = verseIdx + i;
      if (nextIdx < content.verses.length) {
        // Stagger prefetch slightly to avoid overwhelming API
        setTimeout(() => {
          prefetchVerse(nextIdx, content, voice);
          // Also use audioPreloader for additional caching
          const nextVerse = content.verses[nextIdx];
          audioPreloader.preloadVerseTTS(
            content.book, 
            content.chapter, 
            nextVerse.verse, 
            nextVerse.text, 
            voice, 
            i // priority: closer verses have higher priority
          );
        }, i * 50); // Stagger by 50ms each
      }
    }
    
    // Prefetch next chapter when we're past halfway through current chapter
    if (verseIdx > content.verses.length / 2) {
      prefetchNextChapter(currentItemIdx);
    }
    
    // Use already-found currentSeq for commentary settings
    const includeCommentary = currentSeq?.includeJeevesCommentary || false;
    const commentaryMode = currentSeq?.commentaryMode || "chapter";
    const commentaryVoice = currentSeq?.commentaryVoice || "daniel";
    // Use the session-level commentary depth (can be changed mid-session)
    const commentaryDepth = currentCommentaryDepth;
    
    // Prefetch chapter commentary when near end of chapter (verse prefetch moved to top of function)
    if (includeCommentary && commentaryMode === "chapter" && verseIdx >= content.verses.length - 3) {
      const chapterText = content.verses.map(v => `${v.verse}. ${v.text}`).join(" ");
      prefetchChapterCommentary(content.book, content.chapter, chapterText, commentaryVoice, commentaryDepth);
    }

    // Note: Audio already stopped at start of function if needed
    // Don't revoke blob URLs during playback - they may be reused from cache. Clean up on unmount only.

    // CRITICAL: Use MobileAudioEngine for reliable mobile playback
    const currentVolume = isMutedRef.current ? 0 : volumeRef.current / 100;
    console.log("[PlayVerse] Setting up audio with volume:", currentVolume, "playbackRate:", playbackSpeed);

    // Set URL state
    setAudioUrl(url);

    // Handle audio completion callback
    const handleAudioComplete = () => {
      console.log("[Audio] <<< Completed verse:", verseIdx + 1, "| continue:", continuePlayingRef.current, "| isPlayingRef:", isPlayingRef.current, "| isPausedRef:", isPausedRef.current);

      if (!continuePlayingRef.current) {
        console.log("[Audio] continuePlayingRef is false - checking refs for recovery");
        if (isPlayingRef.current && !isPausedRef.current) {
          console.log("[Audio] RECOVERING - forcing continue");
          continuePlayingRef.current = true;
        } else {
          console.log("[Audio] Not continuing - confirmed stop");
          return;
        }
      }

      // Continue with verse/commentary logic...
      handleVerseComplete();
    };
    
    // Define the verse complete handler (logic extracted from old onended)
    const handleVerseComplete = () => {
      
      // Find current sequence to check commentary settings
      const currentSeq = activeSequences.find((seq, idx) => {
        const itemsBefore = activeSequences.slice(0, idx).reduce((acc, s) => acc + s.items.length, 0);
        return currentItemIdx >= itemsBefore && currentItemIdx < itemsBefore + seq.items.length;
      });
      
      const includeCommentary = currentSeq?.includeJeevesCommentary || false;
      const commentaryMode = currentSeq?.commentaryMode || "chapter";
      const commentaryVoice = currentSeq?.commentaryVoice || "daniel";
      // Use the session-level commentary depth (can be changed mid-session)
      const commentaryDepth = currentCommentaryDepth;
      
      const nextVerseIdx = verseIdx + 1;
      const isLastVerse = nextVerseIdx >= content.verses.length;
      
      // Handle verse-by-verse commentary mode
      if (includeCommentary && commentaryMode === "verse" && content && continuePlayingRef.current) {
        const currentVerse = content.verses[verseIdx];
        const cacheKey = `verse-${content.book}-${content.chapter}-${currentVerse.verse}-${commentaryVoice}`;
        const cached = commentaryCache.current.get(cacheKey);
        
        const proceedAfterCommentary = () => {
          // Always check continuePlayingRef before proceeding - use refs to avoid stale closures
          if (!continuePlayingRef.current) {
            console.log("[Verse Commentary] ❌ Stopped - continuePlayingRef is false | isPlayingRef:", isPlayingRef.current, "| isPausedRef:", isPausedRef.current);
            // Try to recover using refs
            if (isPlayingRef.current && !isPausedRef.current) {
              console.log("[Verse Commentary] 🔄 RECOVERING - forcing continue");
              continuePlayingRef.current = true;
            } else {
              // Mark as completed even if stopped
              setCompletedVerseIndices(prev => new Set(prev).add(verseIdx));
              setCurrentCommentaryVerse(null);
              return;
            }
          }

          // Mark verse as completed AFTER checking refs to avoid interference
          setCompletedVerseIndices(prev => new Set(prev).add(verseIdx));
          setCurrentCommentaryVerse(null);

          if (isLastVerse) {
            console.log("[Audio] Chapter complete, moving to next");
            moveToNextChapter();
          } else {
            console.log("[Audio] Playing next verse after commentary:", nextVerseIdx + 1);
            playVerseAtIndex(nextVerseIdx, content, voice);
          }
        };
        
        if (cached?.audioUrl) {
          // Use cached commentary with pre-generated audio - instant playback!
          console.log("[Verse Commentary] Using cached audio for verse", verseIdx + 1);
          setCommentaryText(cached.text);
          setCurrentCommentaryVerse({ index: verseIdx, text: currentVerse.text, verse: currentVerse.verse });
          setIsPlayingCommentary(true);
          playingCommentaryRef.current = true;
          
          // CRITICAL: Prefetch NEXT verse commentary NOW while this commentary plays
          // Commentary playback takes 10-30 seconds - perfect time to prepare next verse
          const nextVerseToPrep = verseIdx + 1;
          if (nextVerseToPrep < content.verses.length) {
            const nextVerse = content.verses[nextVerseToPrep];
            prefetchVerseCommentary(content.book, content.chapter, nextVerse.verse, nextVerse.text, commentaryVoice, commentaryDepth);
          }
          // Also prefetch verse after next
          const afterNextVerse = verseIdx + 2;
          if (afterNextVerse < content.verses.length) {
            const futureVerse = content.verses[afterNextVerse];
            setTimeout(() => {
              prefetchVerseCommentary(content.book, content.chapter, futureVerse.verse, futureVerse.text, commentaryVoice, commentaryDepth);
            }, 500);
          }
          
          const playbackSpeed = currentSeq?.playbackSpeed || 1;
          
          playAudioUrl(cached.audioUrl, {
            volume: isMutedRef.current ? 0 : volumeRef.current / 100,
            playbackRate: playbackSpeed,
            onEnded: () => {
              console.log("[Verse Commentary] Cached audio ended");
              setIsPlayingCommentary(false);
              playingCommentaryRef.current = false;
              setCommentaryText(null);
              proceedAfterCommentary();
            },
            onError: () => {
              console.error("[Verse Commentary] Cached audio error");
              setIsPlayingCommentary(false);
              playingCommentaryRef.current = false;
              setCommentaryText(null);
              proceedAfterCommentary();
            }
          }).then(success => {
            if (!success) {
              console.error("[Verse Commentary] Cached audio play failed");
              setIsPlayingCommentary(false);
              playingCommentaryRef.current = false;
              setCommentaryText(null);
              proceedAfterCommentary();
            }
          });
          return;
        } else if (cached?.text) {
          // Have text but no audio - generate TTS only
          console.log("[Verse Commentary] Using cached text, generating audio");
          setCurrentCommentaryVerse({ index: verseIdx, text: currentVerse.text, verse: currentVerse.verse });

          // Also prefetch next verse while this commentary TTS generates
          const nextVerseToPrep = verseIdx + 1;
          if (nextVerseToPrep < content.verses.length) {
            const nextVerse = content.verses[nextVerseToPrep];
            prefetchVerseCommentary(content.book, content.chapter, nextVerse.verse, nextVerse.text, commentaryVoice, commentaryDepth);
          }

          playCommentary(cached.text, commentaryVoice, proceedAfterCommentary);
          return;
        }
        
        // Fallback: generate everything with timeout protection
        console.log("[Verse Commentary] No cache, generating for verse", verseIdx + 1);
        setCurrentCommentaryVerse({ index: verseIdx, text: currentVerse.text, verse: currentVerse.verse });
        setIsLoading(true);
        
        // Start prefetching next verse while we generate current - use every opportunity
        const nextVerseToPrep = verseIdx + 1;
        if (nextVerseToPrep < content.verses.length) {
          const nextVerse = content.verses[nextVerseToPrep];
          prefetchVerseCommentary(content.book, content.chapter, nextVerse.verse, nextVerse.text, commentaryVoice, commentaryDepth);
        }
        
        // Add timeout to prevent hanging on commentary generation
        const timeoutMs = 15000; // 15 second timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Commentary generation timeout')), timeoutMs)
        );
        
        Promise.race([
          generateVerseCommentary(content.book, content.chapter, currentVerse.verse, currentVerse.text, commentaryDepth),
          timeoutPromise
        ])
          .then((commentary) => {
            setIsLoading(false);
            if (commentary && continuePlayingRef.current) {
              console.log("[Verse Commentary] Generated successfully, playing");
              playCommentary(commentary as string, commentaryVoice, proceedAfterCommentary);
            } else {
              console.log("[Verse Commentary] No commentary or stopped, proceeding");
              proceedAfterCommentary();
            }
          })
          .catch((error) => {
            console.error("[Verse Commentary] Generation failed:", error);
            setIsLoading(false);
            // Still continue playback even if commentary fails
            toast.error("Commentary unavailable, continuing playback", { duration: 2000 });
            proceedAfterCommentary();
          });
        return;
      }
      
      // Handle chapter-by-chapter commentary mode (default)
      if (!isLastVerse) {
        console.log("[Audio] Playing next verse:", nextVerseIdx + 1);
        if (continuePlayingRef.current) {
          playVerseAtIndex(nextVerseIdx, content, voice);
        }
      } else {
        // Chapter complete - check for chapter commentary before moving on
        console.log("[Audio] Chapter complete, checking for chapter commentary...");
        
        if (includeCommentary && commentaryMode === "chapter" && content && continuePlayingRef.current) {
          const cacheKey = `chapter-${content.book}-${content.chapter}-${commentaryVoice}`;
          const cached = commentaryCache.current.get(cacheKey);
          
          if (cached?.audioUrl) {
            // Use cached chapter commentary with pre-generated audio - instant playback!
            console.log("[Chapter Commentary] Using cached audio");
            setCommentaryText(cached.text);
            setIsPlayingCommentary(true);
            playingCommentaryRef.current = true;
            
            const playbackSpeed = currentSeq?.playbackSpeed || 1;
            
            playAudioUrl(cached.audioUrl, {
              volume: isMutedRef.current ? 0 : volumeRef.current / 100,
              playbackRate: playbackSpeed,
              onEnded: () => {
                console.log("[Chapter Commentary] Cached audio ended");
                setIsPlayingCommentary(false);
                playingCommentaryRef.current = false;
                setCommentaryText(null);
                moveToNextChapter();
              },
              onError: () => {
                setIsPlayingCommentary(false);
                playingCommentaryRef.current = false;
                setCommentaryText(null);
                moveToNextChapter();
              }
            }).then(success => {
              if (!success) {
                console.warn("[Chapter Commentary] Play blocked, waiting for user interaction");
                toast.info("Tap to continue audio", { duration: 3000 });
              }
            });
          } else if (cached?.text) {
            // Have text but no audio
            console.log("[Chapter Commentary] Using cached text, generating audio");
            playCommentary(cached.text, commentaryVoice, moveToNextChapter);
          } else {
            // Fallback: generate everything
            console.log("[Chapter Commentary] No cache, generating", commentaryDepth);
            setIsLoading(true);
            const chapterText = content.verses.map(v => `${v.verse}. ${v.text}`).join(" ");
            
            generateCommentary(content.book, content.chapter, chapterText, commentaryDepth, commentaryVoice)
              .then(result => {
                if (result?.text && continuePlayingRef.current) {
                  if (result.audioUrl) {
                    setCommentaryText(result.text);
                    setIsPlayingCommentary(true);
                    playingCommentaryRef.current = true;
                    setIsLoading(false);
                    
                    playAudioUrl(result.audioUrl, {
                      volume: isMutedRef.current ? 0 : volumeRef.current / 100,
                      onEnded: () => {
                        setIsPlayingCommentary(false);
                        playingCommentaryRef.current = false;
                        setCommentaryText(null);
                        moveToNextChapter();
                      },
                      onError: () => {
                        setIsPlayingCommentary(false);
                        playingCommentaryRef.current = false;
                        setCommentaryText(null);
                        moveToNextChapter();
                      }
                    }).catch(() => moveToNextChapter());
                  } else {
                    playCommentary(result.text, commentaryVoice, moveToNextChapter);
                  }
                } else {
                  setIsLoading(false);
                  moveToNextChapter();
                }
              })
              .catch(() => {
                setIsLoading(false);
                moveToNextChapter();
              });
          }
        } else {
          // No commentary - move to next chapter immediately
          console.log("[Audio] No commentary, moving to next chapter immediately");
          moveToNextChapter();
        }
      }
    };

    // Error handler callback for MobileAudioEngine
    const handleAudioError = (error: Error) => {
      console.error("[Audio] Error:", error.message, "verseIdx:", verseIdx + 1);
      stopAudio();
      isGeneratingRef.current = false;
      isSettingUpPlaybackRef.current = false;

      // Retry logic - try up to 2 times, then fall back to browser TTS
      if (retryCountRef.current < 2 && continuePlayingRef.current) {
        retryCountRef.current++;
        console.log(`[Audio] Retrying verse ${verseIdx + 1} (attempt ${retryCountRef.current})`);
        setTimeout(() => {
          if (continuePlayingRef.current) {
            playVerseAtIndex(verseIdx, content, voice);
          }
        }, 500);
      } else if (continuePlayingRef.current) {
        // Fall back to browser TTS after retries exhausted
        console.log("[Audio] Falling back to browser TTS after errors");
        retryCountRef.current = 0;
        speakWithBrowserTTS(verse.text, playbackSpeed, () => {
          if (continuePlayingRef.current && verseIdx < content.verses.length - 1) {
            setTimeout(() => playVerseAtIndex(verseIdx + 1, content, voice), 300);
          } else if (verseIdx >= content.verses.length - 1) {
            handleChapterCompleteWithCommentary(content);
          }
        });
      } else {
        setIsPlaying(false);
      }
    };

    // Start playback using MobileAudioEngine
    console.log("[Audio] Starting playback via MobileAudioEngine...");
    const playSuccess = await mobileAudioEngine.play(url, {
      volume: currentVolume,
      playbackRate: playbackSpeed,
      onEnded: handleAudioComplete,
      onError: handleAudioError
    });

    if (playSuccess) {
      console.log("[Audio] play() succeeded for verse:", verseIdx + 1);
      retryCountRef.current = 0;
      isSettingUpPlaybackRef.current = false;
      setIsPlaying(true);
      setIsPaused(false);
      // Store current position for potential resume
      pausedVerseRef.current = { verseIdx, content, voice };
    } else {
      console.error("[Audio] play() failed for verse:", verseIdx + 1);
      isSettingUpPlaybackRef.current = false;

      // Try browser TTS fallback
      if (continuePlayingRef.current) {
        console.log("[Audio] play() failed, falling back to browser TTS");
        speakWithBrowserTTS(verse.text, playbackSpeed, () => {
          if (continuePlayingRef.current && verseIdx < content.verses.length - 1) {
            setTimeout(() => playVerseAtIndex(verseIdx + 1, content, voice), 300);
          } else if (verseIdx >= content.verses.length - 1) {
            handleChapterCompleteWithCommentary(content);
          }
        });
      } else {
        setIsPlaying(false);
      }
    }
  }, [volume, isMuted, totalItems, generateTTS, prefetchVerse, activeSequences, currentItemIdx, currentSeqIdx, generateCommentary, playCommentary, moveToNextChapter, handleChapterCompleteWithCommentary, prefetchNextChapter, offlineMode, speakWithBrowserTTS, saveCurrentPosition, stopAudio, playAudioUrl]);

  // Play current verse (wrapper for playVerseAtIndex)
  const playCurrentVerse = useCallback(() => {
    if (!chapterContent) return;
    const voice = currentSequence?.voice || "daniel";
    continuePlayingRef.current = true;
    playVerseAtIndex(currentVerseIdx, chapterContent, voice);
  }, [chapterContent, currentVerseIdx, currentSequence, playVerseAtIndex]);

  // Load chapter when item changes - CRITICAL: This must run immediately on mobile
  // Do not include chapterContent in dependencies to avoid circular issues
  useEffect(() => {
    console.log("[ChapterLoad Effect] Running - currentItem:", currentItem ? `${currentItem.book} ${currentItem.chapter}` : "NULL", "isMobile:", isMobile);
    if (!currentItem) {
      console.log("No current item, skipping chapter load. allItems:", allItems.length, "activeSequences:", activeSequences.length);
      return;
    }
    
    const cacheKey = `${currentItem.book}-${currentItem.chapter}`;
    
    // Skip if already fetching
    if (isFetchingChapterRef.current) {
      console.log("Already fetching, skipping load for:", cacheKey);
      return;
    }
    
    // Skip if we already fetched this AND content is still loaded
    // (chapterContent check is critical - if content was cleared, we need to reload)
    if (lastFetchedRef.current === cacheKey && chapterContent) {
      console.log("Already fetched and content present:", cacheKey);
      return;
    }

    const loadChapter = async (retryCount = 0) => {
      console.log("[ChapterLoad] Starting load for:", cacheKey, "retry:", retryCount, "isMobile:", isMobile);
      isFetchingChapterRef.current = true;
      setIsLoading(true);
      
      try {
        const verses = await fetchChapter(currentItem.book, currentItem.chapter);
        console.log("[ChapterLoad] Fetch result:", verses ? `${verses.length} verses` : "null");
        
        isFetchingChapterRef.current = false;
        
        if (verses && verses.length > 0) {
          // Filter verses if start/end specified
          let filteredVerses = verses;
          if (currentItem.startVerse) {
            filteredVerses = verses.filter(
              (v) =>
                v.verse >= (currentItem.startVerse || 1) &&
                v.verse <= (currentItem.endVerse || verses.length)
            );
          }
          lastFetchedRef.current = cacheKey;
          setChapterContent({
            book: currentItem.book,
            chapter: currentItem.chapter,
            verses: filteredVerses,
          });
          setIsLoading(false);
          console.log("[ChapterLoad] SUCCESS - Chapter content set:", filteredVerses.length, "verses");
        } else if (retryCount < 3) {
          // MOBILE: More aggressive retry - shorter delay (1s instead of 1.5s)
          const retryDelay = isMobile ? 1000 : 1500;
          console.log("[ChapterLoad] No verses returned, retrying in", retryDelay, "ms... (attempt", retryCount + 1, "of 3)");
          isFetchingChapterRef.current = false;
          setIsLoading(false); // Show "Tap to Retry" instead of infinite spinner
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return loadChapter(retryCount + 1);
        } else {
          console.error("[ChapterLoad] FAILED after all retries:", cacheKey);
          isFetchingChapterRef.current = false;
          setIsLoading(false);
          // Show clear error message to user
          toast.error(`Unable to load ${currentItem.book} ${currentItem.chapter}. Please check your connection and tap Retry.`, { duration: 8000 });
        }
      } catch (e) {
        console.error("[ChapterLoad] Error:", e);
        isFetchingChapterRef.current = false;
        setIsLoading(false); // Critical: ensure loading state is cleared on error
        if (retryCount < 3) {
          const retryDelay = isMobile ? 1000 : 1500;
          console.log("[ChapterLoad] Error occurred, retrying in", retryDelay, "ms... (attempt", retryCount + 1, "of 3)");
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return loadChapter(retryCount + 1);
        } else {
          toast.error(`Failed to load chapter after 3 attempts. Please check your connection.`, { duration: 8000 });
        }
      }
    };

    // Start loading immediately
    loadChapter();
  }, [currentItem?.book, currentItem?.chapter, currentItem?.startVerse, currentItem?.endVerse, fetchChapter, isMobile, allItems.length, activeSequences.length]);

  // Auto-play when new chapter content loads (for chapter transitions)
  useEffect(() => {
    if (
      shouldPlayNextRef.current &&
      chapterContent &&
      !isLoading &&
      !isGeneratingRef.current &&
      !mobileAudioEngine.isPlaying()
    ) {
      console.log("Auto-playing next chapter after transition");
      shouldPlayNextRef.current = false;
      const voice = currentSequence?.voice || "daniel";
      continuePlayingRef.current = true;

      // Start background preloading for the new chapter
      const includeCommentary = currentSequence?.includeJeevesCommentary || false;
      const commentaryMode = currentSequence?.commentaryMode || "chapter";
      const commentaryVoice = currentSequence?.commentaryVoice || "daniel";

      if (includeCommentary && commentaryMode === "verse" && !offlineMode) {
        console.log("[Preload] Auto-play transition - preloading ALL verse commentary...");
        prefetchAllChapterVerseCommentary(chapterContent, commentaryVoice, currentCommentaryDepth, 0);
      }

      // Check for commentary-only mode
      if (currentSequence?.commentaryOnly && currentSequence?.includeJeevesCommentary) {
        console.log("[Commentary Only] Skipping verse reading, playing commentary only");
        playCommentaryOnlyChapter(chapterContent, currentSequence);
      } else {
        // Notify music ducking for regular Bible reading
        notifyTTSStarted();
        playVerseAtIndex(0, chapterContent, voice);
      }
    }
  }, [chapterContent, isLoading, currentSequence, playVerseAtIndex, prefetchAllChapterVerseCommentary, currentCommentaryDepth, offlineMode]);

  // EAGER PRELOADING: Start preloading commentary as soon as chapter loads (before play is clicked)
  useEffect(() => {
    // Guard: only run if we have content and sequence
    if (!chapterContent || isLoading || !currentSequence) return;

    const includeCommentary = currentSequence.includeJeevesCommentary || false;
    const commentaryMode = currentSequence.commentaryMode || "chapter";
    const commentaryVoice = currentSequence.commentaryVoice || "daniel";

    // Only preload if verse-by-verse commentary is enabled and we're online
    if (includeCommentary && commentaryMode === "verse" && !offlineMode) {
      console.log("[Eager Preload] Chapter loaded - starting background commentary preload...");
      // Start from verse 0 to preload everything
      prefetchAllChapterVerseCommentary(chapterContent, commentaryVoice, currentCommentaryDepth, 0);
    }
  }, [chapterContent, isLoading, currentSequence, prefetchAllChapterVerseCommentary, currentCommentaryDepth, offlineMode]);

  // Track if we're waiting for user tap on mobile
  const [waitingForMobileTap, setWaitingForMobileTap] = useState(false);

  // Auto-start on mount - runs once when autoPlay is true
  // On mobile, we can't auto-start due to browser restrictions - show tap prompt instead
  useEffect(() => {
    console.log("[AutoStart Effect] autoPlay:", autoPlay, "hasStarted:", hasStarted, "isMobile:", isMobile);
    if (!autoPlay || hasStarted) return;

    // On mobile, don't auto-start - wait for user tap
    if (isMobile) {
      console.log("[AutoStart] Mobile detected - waiting for user tap to start");
      setWaitingForMobileTap(true);
      return;
    }

    // Wait for content to be ready, then start
    const checkAndStart = () => {
      console.log("[AutoStart] Checking:", {
        hasContent: !!chapterContent,
        versesCount: chapterContent?.verses?.length,
        isLoading,
        isGenerating: isGeneratingRef.current,
        audioState: mobileAudioEngine.getState()
      });

      if (
        chapterContent &&
        chapterContent.verses &&
        chapterContent.verses.length > 0 &&
        !isLoading &&
        !isGeneratingRef.current &&
        !mobileAudioEngine.isPlaying()
      ) {
        console.log("[AutoStart] Starting playback with", chapterContent.verses.length, "verses");
        setHasStarted(true);
        const voice = currentSequence?.voice || "daniel";
        continuePlayingRef.current = true;

        // Check for commentary-only mode
        if (currentSequence?.commentaryOnly && currentSequence?.includeJeevesCommentary) {
          console.log("[Commentary Only] Auto-starting with commentary only");
          playCommentaryOnlyChapter(chapterContent, currentSequence);
        } else {
          // Notify music ducking for regular Bible reading
          notifyTTSStarted();
          // Don't set isPlaying here - let playVerseAtIndex do it after audio actually starts
          playVerseAtIndex(0, chapterContent, voice);
        }
        return true;
      }
    };

    // Try immediately
    if (checkAndStart()) return;

    // If not ready, poll briefly
    const interval = setInterval(() => {
      if (checkAndStart()) {
        clearInterval(interval);
      }
    }, 300);

    // Clean up after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      console.log("[AutoStart] Timeout - content never became ready");
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [autoPlay, hasStarted, chapterContent, isLoading, currentSequence, playVerseAtIndex, isMobile]);

  // Handle mobile tap to start - this provides the user gesture needed for audio
  const handleMobileTapToStart = useCallback(async () => {
    console.log("[Mobile] User tapped to start playback");
    setWaitingForMobileTap(false);
    setHasStarted(true);

    // CRITICAL: Wait for audio unlock to complete before attempting playback
    const unlocked = await ensureAudioUnlocked();
    console.log("[Mobile] Audio unlock result:", unlocked);

    if (chapterContent && chapterContent.verses && chapterContent.verses.length > 0) {
      const voice = currentSequence?.voice || "daniel";
      continuePlayingRef.current = true;

      if (currentSequence?.commentaryOnly && currentSequence?.includeJeevesCommentary) {
        playCommentaryOnlyChapter(chapterContent, currentSequence);
      } else {
        notifyTTSStarted();
        playVerseAtIndex(0, chapterContent, voice);
      }
    }
  }, [chapterContent, currentSequence, playVerseAtIndex, ensureAudioUnlocked]);

  const handlePlay = async () => {
    console.log("handlePlay called - isPaused:", isPaused, "audioState:", mobileAudioEngine.getState(), "speechPaused:", speechSynthesis.paused);
    console.log("[handlePlay] chapterContent:", chapterContent ? `${chapterContent.book} ${chapterContent.chapter} (${chapterContent.verses?.length} verses)` : "NULL");
    console.log("[handlePlay] currentVerseIdx:", currentVerseIdx, "currentSequence:", currentSequence?.sequenceNumber);

    // CRITICAL: Unlock audio on first user interaction (iOS requirement)
    // Must await to ensure audio is ready before playback
    const unlocked = await ensureAudioUnlocked();
    console.log("[handlePlay] Audio unlock result:", unlocked);

    // Resume paused HTML Audio via MobileAudioEngine
    if (isPaused && mobileAudioEngine.getState() === 'paused') {
      continuePlayingRef.current = true;
      const resumeSuccess = await mobileAudioEngine.resume();
      if (!resumeSuccess) {
        console.error("[Resume] Audio resume failed");
        // If resume fails, restart from current verse
        if (pausedVerseRef.current) {
          playVerseAtIndex(pausedVerseRef.current.verseIdx, pausedVerseRef.current.content, pausedVerseRef.current.voice);
        }
      }
      setIsPaused(false);
      setIsPlaying(true);
      // Don't duck music in commentary-only mode
      if (!currentSequence?.commentaryOnly) {
        notifyTTSStarted();
      }
      return;
    }

    // Resume paused browser speech synthesis
    if (isPaused && speechSynthesis.paused) {
      continuePlayingRef.current = true;
      speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      // Don't duck music in commentary-only mode
      if (!currentSequence?.commentaryOnly) {
        notifyTTSStarted();
      }
      return;
    }

    // Start fresh playback (or resume from stored position)
    if (chapterContent) {
      console.log("Starting playback from verse:", currentVerseIdx + 1);
      const voice = currentSequence?.voice || "daniel";
      continuePlayingRef.current = true;
      setIsPlaying(true);
      setIsPaused(false);

      // AGGRESSIVE PRELOADING: Start background prefetch of ALL verse commentary
      // This runs in the background while playback proceeds, ensuring commentary is ready
      const includeCommentary = currentSequence?.includeJeevesCommentary || false;
      const commentaryMode = currentSequence?.commentaryMode || "chapter";
      const commentaryVoice = currentSequence?.commentaryVoice || "daniel";

      if (includeCommentary && commentaryMode === "verse" && !offlineMode) {
        console.log("[Preload] Starting background preload of ALL verse commentary...");
        // Fire and forget - runs in background while playback starts
        prefetchAllChapterVerseCommentary(
          chapterContent,
          commentaryVoice,
          currentCommentaryDepth,
          currentVerseIdx // Start from current verse
        );
      }

      // Check for commentary-only mode
      if (currentSequence?.commentaryOnly && currentSequence?.includeJeevesCommentary) {
        console.log("[Commentary Only] Starting with commentary only");
        playCommentaryOnlyChapter(chapterContent, currentSequence);
      } else {
        // Notify music ducking for regular Bible reading
        notifyTTSStarted();
        playVerseAtIndex(currentVerseIdx, chapterContent, voice);
      }
    } else {
      console.warn("[handlePlay] No chapterContent available! Cannot start playback.");
      console.log("[handlePlay] Current state - isLoading:", isLoading, "currentItem:", currentItem ? `${currentItem.book} ${currentItem.chapter}` : "NULL");
      // Try to trigger chapter load if we have a current item but no content
      if (currentItem && !isFetchingChapterRef.current) {
        console.log("[handlePlay] Attempting to load chapter manually...");
        setIsLoading(true);
        fetchChapter(currentItem.book, currentItem.chapter).then(verses => {
          setIsLoading(false);
          if (verses) {
            let filteredVerses = verses;
            if (currentItem.startVerse) {
              filteredVerses = verses.filter(
                (v) => v.verse >= (currentItem.startVerse || 1) && v.verse <= (currentItem.endVerse || verses.length)
              );
            }
            setChapterContent({
              book: currentItem.book,
              chapter: currentItem.chapter,
              verses: filteredVerses,
            });
            toast.info("Chapter loaded, tap play again", { duration: 2000 });
          } else {
            toast.error("Failed to load chapter");
          }
        });
      }
    }
  };

  const handlePause = () => {
    console.log("[Player] PAUSE CALLED - setting continuePlayingRef to false");
    continuePlayingRef.current = false;

    // Handle audio pause via MobileAudioEngine
    if (mobileAudioEngine.isPlaying()) {
      mobileAudioEngine.pause();
      setIsPaused(true);
      // Don't stop music ducking in commentary-only mode (music should keep playing)
      if (!currentSequence?.commentaryOnly) {
        notifyTTSStopped();
      }
    }

    // Handle browser speech synthesis pause
    if (speechSynthesis.speaking) {
      speechSynthesis.pause();
      setIsPaused(true);
      // Don't stop music ducking in commentary-only mode (music should keep playing)
      if (!currentSequence?.commentaryOnly) {
        notifyTTSStopped();
      }
    }
    
    // Store current position for resume
    if (chapterContent) {
      const voice = currentSequence?.voice || "daniel";
      pausedVerseRef.current = { verseIdx: currentVerseIdx, content: chapterContent, voice };
    }
  };

  const handleStop = () => {
    console.log("[Player] ⏹️ STOP CALLED - setting continuePlayingRef to false");
    continuePlayingRef.current = false;
    pendingVerseRef.current = null;
    pausedVerseRef.current = null;
    
    // Stop HTML Audio using persistent helper (don't null the ref)
    stopAudio();
    
    // Stop browser speech synthesis
    speechSynthesis.cancel();
    browserUtteranceRef.current = null;
    
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentItemIdx(0);
    setCurrentVerseIdx(0);
    setChapterContent(null);
    lastFetchedRef.current = null;
    shouldPlayNextRef.current = false;
    retryCountRef.current = 0;
    isSettingUpPlaybackRef.current = false; // Clear setup flag on stop
    // Always stop music ducking when stopping playback
    notifyTTSStopped();
  };

  const handleSkipNext = () => {
    pendingVerseRef.current = null;
    stopAudio();
    speechSynthesis.cancel();
    browserUtteranceRef.current = null;
    
    // Clear commentary state when skipping
    setIsPlayingCommentary(false);
    playingCommentaryRef.current = false;
    setCommentaryText(null);
    
    if (currentItemIdx < totalItems - 1) {
      // Allow auto-play when skipping: if we were playing OR paused (user wants to continue), set shouldPlayNext
      const wasActive = isPlaying || isPaused;
      shouldPlayNextRef.current = wasActive;
      continuePlayingRef.current = wasActive;
      
      // Set playing state immediately for better UX on mobile
      if (wasActive) {
        setIsPlaying(true);
        setIsPaused(false);
      }
      
      setCurrentItemIdx((prev) => prev + 1);
      setCurrentVerseIdx(0);
      setChapterContent(null);
      lastFetchedRef.current = null;
    }
  };

  const handleSkipPrev = () => {
    pendingVerseRef.current = null;
    stopAudio();
    speechSynthesis.cancel();
    browserUtteranceRef.current = null;
    
    // Clear commentary state when skipping
    setIsPlayingCommentary(false);
    playingCommentaryRef.current = false;
    setCommentaryText(null);
    
    if (currentItemIdx > 0) {
      // Allow auto-play when skipping: if we were playing OR paused (user wants to continue), set shouldPlayNext
      const wasActive = isPlaying || isPaused;
      shouldPlayNextRef.current = wasActive;
      continuePlayingRef.current = wasActive;
      
      // Set playing state immediately for better UX on mobile
      if (wasActive) {
        setIsPlaying(true);
        setIsPaused(false);
      }
      
      setCurrentItemIdx((prev) => prev - 1);
      setCurrentVerseIdx(0);
      setChapterContent(null);
      lastFetchedRef.current = null;
    } else {
      const wasActive = isPlaying || isPaused;
      shouldPlayNextRef.current = wasActive;
      continuePlayingRef.current = wasActive;
      setCurrentVerseIdx(0);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    console.log('[SequencePlayer] TTS volume changed to:', newVolume);
    setVolume(newVolume);
    // Apply immediately to current audio via MobileAudioEngine
    const effectiveVolume = isMutedRef.current ? 0 : newVolume / 100;
    mobileAudioEngine.setVolume(effectiveVolume);
    console.log('[SequencePlayer] Applied TTS volume via MobileAudioEngine:', effectiveVolume);
  };

  const handleMusicVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0];
    console.log('[SequencePlayer] Music volume slider changed to:', newVolume);
    
    // Update state
    setMusicVolume(newVolume);
    
    // Update internal music player immediately and synchronously (critical for mobile)
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = newVolume / 100;
      console.log('[SequencePlayer] Internal music volume set to:', newVolume / 100);
    }
    
    // Also update the global ambient music player (for external AmbientMusicPlayer component)
    setGlobalMusicVolume(newVolume);
    
    // Force immediate update on any audio elements with class 'ambient-music' (backup)
    const audioElements = document.querySelectorAll('audio.ambient-music');
    audioElements.forEach((audio: Element) => {
      if (audio instanceof HTMLAudioElement) {
        audio.volume = newVolume / 100;
      }
    });
  }, []);

  // Handle voice change - clear cache and regenerate current audio
  const handleVoiceChange = useCallback((newVoice: VoiceId) => {
    console.log("[Voice] Changing voice from", currentVoice, "to", newVoice);
    setCurrentVoice(newVoice);
    
    // Clear TTS cache to force regeneration with new voice
    ttsCache.current.clear();
    prefetchingRef.current.clear();
    commentaryCache.current.clear();
    prefetchingCommentaryRef.current.clear();
    
    // If currently playing, regenerate current verse/commentary
    if (isPlaying && !isPaused && chapterContent && currentItem) {
      const wasPlayingCommentary = isPlayingCommentary;

      // Stop current audio via MobileAudioEngine
      mobileAudioEngine.stop();
      if (browserUtteranceRef.current) {
        speechSynthesis.cancel();
        browserUtteranceRef.current = null;
      }
      
      // Regenerate and continue from current position
      if (wasPlayingCommentary && commentaryText) {
        console.log("[Voice] Re-generating commentary with new voice");
        playCommentary(commentaryText, newVoice, () => {
          if (continuePlayingRef.current) {
            playVerseAtIndex(currentVerseIdx + 1, chapterContent, newVoice);
          }
        });
      } else {
        console.log("[Voice] Re-generating verse with new voice");
        playVerseAtIndex(currentVerseIdx, chapterContent, newVoice);
      }
    }
    
    const voiceName = OPENAI_VOICES.find(v => v.id === newVoice)?.name || newVoice;
    toast.success(`Voice changed to ${voiceName}`);
  }, [currentVoice, isPlaying, isPaused, chapterContent, currentItem, isPlayingCommentary, commentaryText, currentVerseIdx]);

  // Handle commentary depth change - clear commentary cache
  const handleCommentaryDepthChange = useCallback((newDepth: "surface" | "intermediate" | "depth" | "deep-drill") => {
    console.log("[Commentary] Changing depth from", currentCommentaryDepth, "to", newDepth);
    setCurrentCommentaryDepth(newDepth);
    
    // Clear commentary cache to force regeneration with new depth
    commentaryCache.current.clear();
    prefetchingCommentaryRef.current.clear();
    
    const depthLabels = { surface: "Surface", intermediate: "Intermediate", depth: "Scholarly", "deep-drill": "Deep Drill" };
    toast.success(`Commentary depth changed to ${depthLabels[newDepth]}`);
  }, [currentCommentaryDepth]);

  const toggleMute = () => {
    const newMuted = !isMuted;
    console.log('[SequencePlayer] Mute toggled to:', newMuted);
    setIsMuted(newMuted);
    // Apply immediately to current audio via MobileAudioEngine
    const effectiveVolume = newMuted ? 0 : volumeRef.current / 100;
    mobileAudioEngine.setVolume(effectiveVolume);
    console.log('[SequencePlayer] Applied mute toggle via MobileAudioEngine:', effectiveVolume);
  };
  // Auto-scroll to current verse
  useEffect(() => {
    if (chapterContent && currentVerseIdx >= 0) {
      const verseNum = chapterContent.verses[currentVerseIdx]?.verse;
      if (verseNum) {
        const el = document.getElementById(`verse-${verseNum}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentVerseIdx, chapterContent]);

  // Cleanup on unmount only - not on audioUrl change (that was causing the race condition)
  useEffect(() => {
    return () => {
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
      }
      continuePlayingRef.current = false;
      stopAudio();
      // Cancel browser speech synthesis on unmount
      speechSynthesis.cancel();
      browserUtteranceRef.current = null;
      notifyTTSStopped();
      
      // Clean up all blob URLs on unmount
      console.log("[SequencePlayer] Cleaning up", blobUrlsRef.current.size, "blob URLs on unmount");
      blobUrlsRef.current.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          // Ignore errors - URL may already be revoked
        }
      });
      blobUrlsRef.current.clear();
    };
  }, []);

  if (activeSequences.length === 0) {
    return (
      <Card className="border-dashed glass-card bg-card/30 backdrop-blur-xl">
        <CardContent className="py-8 text-center text-muted-foreground">
          <ListMusic className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No chapters added to your sequence yet.</p>
          <p className="text-sm mt-2">Add books and chapters above to start listening.</p>
        </CardContent>
      </Card>
    );
  }

  const progressPercent = chapterContent
    ? ((currentVerseIdx + 1) / chapterContent.verses.length) * 100
    : 0;

  // Save commentary as gem handler
  const handleSaveCommentaryAsGem = async () => {
    if (!user || !commentaryText || !chapterContent || !currentCommentaryVerse) {
      toast.error("Unable to save - please try again");
      return;
    }

    setSavingGem(true);
    try {
      const verseRef = `${chapterContent.book} ${chapterContent.chapter}:${currentCommentaryVerse.verse}`;
      const gemTitle = `Commentary on ${verseRef}`;
      const gemContent = `**${verseRef}**\n\n_"${currentCommentaryVerse.text}"_\n\n---\n\n${commentaryText}`;

      // Save to user_gems table
      const { error: saveError } = await supabase.from("user_gems").insert({
        user_id: user.id,
        gem_name: gemTitle,
        gem_content: gemContent,
        room_id: "GR", // Gems Room
        floor_number: 1,
        category: "Bible Commentary",
      });

      if (saveError) throw saveError;

      toast.success("Commentary saved to your Gems! 💎");
    } catch (error) {
      console.error("Error saving gem:", error);
      toast.error("Failed to save gem");
    } finally {
      setSavingGem(false);
    }
  };

  // Music URL - use cached version when offline
  // Using peaceful ambient track without bells/chimes
  const [musicUrl, setMusicUrl] = useState("https://cdn.pixabay.com/download/audio/2022/03/15/audio_8e5e3b4b5a.mp3");
  
  useEffect(() => {
    const loadMusicUrl = async () => {
      const defaultUrl = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_8e5e3b4b5a.mp3";
      if (offlineMode || !isOnline()) {
        const cached = await getCachedMusicTrack(defaultUrl);
        if (cached) {
          console.log("[Music] Using cached music track");
          setMusicUrl(cached);
        }
      } else {
        setMusicUrl(defaultUrl);
      }
    };
    loadMusicUrl();
  }, [offlineMode]);

  return (
    <>
      {/* Hidden background music audio element */}
      <audio
        ref={setMusicAudioRef}
        src={musicUrl}
        loop
        preload="auto"
        onLoadedData={(e) => {
          const audio = e.currentTarget;
          audio.volume = musicVolume / 100;
        }}
      />
      <Card className="overflow-hidden glass-card border-white/10 bg-card/50 backdrop-blur-xl">
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Now Playing
          </CardTitle>
          <div className="flex items-center gap-2">
            {onClose && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onClose}
                title="Start over with new selections"
                className="glass-card-subtle"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                <span className="hidden sm:inline">Start Over</span>
              </Button>
            )}
            <DownloadSequenceDialog 
              sequences={sequences}
              trigger={
                <Button variant="ghost" size="icon" title="Download Audio">
                  <Download className="h-4 w-4" />
                </Button>
              }
            />
            <Badge variant="outline">
              {currentItemIdx + 1} / {totalItems} chapters
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Start/Resume Section - Consolidated single panel */}
        {!hasStarted && !isPlaying && !isPaused && (() => {
          // Check if we have a saved position to resume from
          const hasSavedPosition = showResumeOption && savedPosition;
          const savedSeq = hasSavedPosition ? activeSequences[savedPosition.seqIdx] : null;
          const savedItem = savedSeq?.items[savedPosition.itemIdx];
          const savedBookChapter = savedItem ? `${savedItem.book} ${savedItem.chapter}` : `Chapter ${(savedPosition?.itemIdx || 0) + 1}`;
          
          // Determine what to show based on loading state
          const showLoading = isLoading;
          const showRetry = !isLoading && !chapterContent && currentItem;
          const showReady = !isLoading && chapterContent;
          
          return (
            <div className={`rounded-xl border-2 overflow-hidden p-5 ${
              hasSavedPosition 
                ? "border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-sky-500/5 to-blue-500/10 shadow-lg shadow-blue-500/10"
                : showLoading
                  ? "border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-blue-500/10"
                  : showRetry
                    ? "border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10"
                    : "border-green-500/30 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-green-500/10"
            }`}>
              {/* Header with icon and status */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`h-14 w-14 rounded-full flex items-center justify-center shadow-lg ${
                  hasSavedPosition
                    ? "bg-gradient-to-br from-blue-500 to-sky-600 shadow-blue-500/30"
                    : showLoading 
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30 animate-pulse"
                      : showRetry 
                        ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30"
                        : "bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30"
                }`}>
                  {showLoading ? (
                    <Loader2 className="h-7 w-7 text-white animate-spin" />
                  ) : showRetry ? (
                    <RefreshCw className="h-7 w-7 text-white" />
                  ) : (
                    <Play className="h-7 w-7 text-white ml-1" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg ${
                    hasSavedPosition
                      ? "text-blue-600 dark:text-blue-400"
                      : showLoading 
                        ? "text-blue-600 dark:text-blue-400"
                        : showRetry 
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-green-600 dark:text-green-400"
                  }`}>
                    {hasSavedPosition 
                      ? "Continue Where You Left Off?" 
                      : showLoading 
                        ? "Loading Verses..." 
                        : showRetry 
                          ? "Connection Issue" 
                          : "Ready to Play"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {hasSavedPosition 
                      ? `${savedBookChapter}:${savedPosition.verseIdx + 1}`
                      : chapterContent 
                        ? `${chapterContent.book} ${chapterContent.chapter} • ${chapterContent.verses.length} verses`
                        : currentItem 
                          ? `${currentItem.book} ${currentItem.chapter}`
                          : "Preparing..."}
                  </p>
                  {showLoading && (
                    <p className="text-xs text-blue-500 mt-1">
                      Please wait, fetching Bible content...
                    </p>
                  )}
                  {showRetry && (
                    <p className="text-xs text-amber-500 mt-1">
                      Tap below to retry loading
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {hasSavedPosition ? (
                  <>
                    <Button
                      onClick={handleResume}
                      size="lg"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white py-5"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Resume
                    </Button>
                    <Button
                      onClick={handleStartFresh}
                      variant="outline"
                      size="lg"
                      className="flex-1 border-blue-500/30 hover:bg-blue-500/10 py-5"
                    >
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Start Fresh
                    </Button>
                  </>
                ) : showLoading ? (
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5"
                    disabled
                  >
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Loading...
                  </Button>
                ) : showRetry ? (
                  <Button
                    onClick={() => {
                      // Force reload by clearing cache key
                      lastFetchedRef.current = null;
                      isFetchingChapterRef.current = false;
                      // Clear chapter cache for this item
                      const cacheKey = `${currentItem.book}-${currentItem.chapter}`;
                      chapterCache.current.delete(cacheKey);
                      // Manually trigger load
                      const loadNow = async () => {
                        setIsLoading(true);
                        console.log("[Mobile Retry] Manual load triggered for:", cacheKey);
                        const verses = await fetchChapter(currentItem.book, currentItem.chapter);
                        if (verses && verses.length > 0) {
                          let filteredVerses = verses;
                          if (currentItem.startVerse) {
                            filteredVerses = verses.filter(
                              (v) =>
                                v.verse >= (currentItem.startVerse || 1) &&
                                v.verse <= (currentItem.endVerse || verses.length)
                            );
                          }
                          lastFetchedRef.current = cacheKey;
                          setChapterContent({
                            book: currentItem.book,
                            chapter: currentItem.chapter,
                            verses: filteredVerses,
                          });
                          console.log("[Mobile Retry] SUCCESS - loaded", filteredVerses.length, "verses");
                        } else {
                          toast.error("Unable to load. Please check your connection.");
                        }
                        setIsLoading(false);
                      };
                      loadNow();
                    }}
                    size="lg"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-5"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Retry Loading
                  </Button>
                ) : (
                  <Button
                    onClick={isMobile ? handleMobileTapToStart : handlePlay}
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-5"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Play Now
                  </Button>
                )}
              </div>
            </div>
          );
        })()}


        {/* Commentary Display - shown when Jeeves is commenting */}
        {isPlayingCommentary && commentaryText && (
          <div className="rounded-xl border-2 border-amber-500/30 overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 shadow-lg shadow-amber-500/10">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-b border-amber-500/20 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <span className="text-xl">🎩</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-600 dark:text-amber-400">Jeeves Commentary</h3>
                <p className="text-xs text-muted-foreground">Phototheological Insights</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Commentary Audio Controls */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-amber-600 hover:text-amber-500 hover:bg-amber-500/10"
                  onClick={() => {
                    if (mobileAudioEngine.isPlaying() || mobileAudioEngine.getState() === 'paused') {
                      mobileAudioEngine.seek(0);
                      toast.success("Restarted from beginning", { duration: 1500 });
                    } else if (browserUtteranceRef.current && window.speechSynthesis) {
                      // For browser TTS, cancel and restart
                      window.speechSynthesis.cancel();
                      const utterance = new SpeechSynthesisUtterance(commentaryText);
                      utterance.rate = currentSequence?.playbackSpeed || 1;
                      browserUtteranceRef.current = utterance;
                      window.speechSynthesis.speak(utterance);
                      toast.success("Restarted from beginning", { duration: 1500 });
                    }
                  }}
                  title="Restart commentary from beginning"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-amber-600 hover:text-amber-500 hover:bg-amber-500/10"
                  onClick={() => {
                    if (mobileAudioEngine.isPlaying() || mobileAudioEngine.getState() === 'paused') {
                      const currentTime = mobileAudioEngine.getCurrentTime();
                      mobileAudioEngine.seek(Math.max(0, currentTime - 10));
                      toast.success("Rewound 10 seconds", { duration: 1500 });
                    }
                  }}
                  title="Rewind 10 seconds"
                >
                  <RefreshCw className="h-4 w-4 transform scale-x-[-1]" />
                </Button>
                <ExportToStudyButton
                  type="commentary"
                  title={`${currentItem?.book || "Bible"} ${currentItem?.chapter || 1} Commentary`}
                  content={commentaryText}
                  metadata={{
                    book: currentItem?.book,
                    chapter: currentItem?.chapter,
                    depth: currentCommentaryDepth === "depth" ? "Scholarly" : currentCommentaryDepth === "intermediate" ? "Intermediate" : "Surface",
                  }}
                  size="sm"
                  variant="ghost"
                  className="text-amber-600 hover:text-amber-500"
                />
                <CommentaryPDFExport
                  commentary={commentaryText}
                  book={currentItem?.book || ""}
                  chapter={currentItem?.chapter || 1}
                  depth={currentCommentaryDepth}
                  size="sm"
                  variant="outline"
                />
                <ExportCommentaryDialog
                  commentaryText={commentaryText}
                  book={currentItem?.book || ""}
                  chapter={currentItem?.chapter || 1}
                  verseText={chapterContent?.verses?.map(v => `${v.verse}. ${v.text}`).join(" ") || ""}
                  voice={currentVoice}
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-amber-600 hover:text-amber-500 hover:bg-amber-500/10"
                      title="Export & share audio"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  }
                />
                <Badge variant="secondary" className="animate-pulse bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30">
                  <span className="mr-1">🔊</span> Speaking
                </Badge>
              </div>
            </div>
            {/* Commentary Content */}
            <ScrollArea className="max-h-[350px]">
              <div className="p-5 prose prose-sm dark:prose-invert max-w-none">
                {formatJeevesResponse(commentaryText)}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Offline Mode Toggle */}
        <OfflineModeToggle
          offlineMode={offlineMode}
          onOfflineModeChange={setOfflineMode}
          className="mb-2"
        />

        {/* Current Chapter Display */}
        <div className="text-center py-4 bg-muted/30 rounded-lg">
          <p className="text-2xl font-bold flex items-center justify-center gap-2">
            {offlineMode && <WifiOff className="h-4 w-4 text-amber-500" />}
            {currentItem?.book} {currentItem?.chapter}
          </p>
          {currentItem?.startVerse && (
            <p className="text-sm text-muted-foreground">
              Verses {currentItem.startVerse}-{currentItem.endVerse || "end"}
            </p>
          )}
          {chapterContent && !isPlayingCommentary && (
            <p className="text-sm text-muted-foreground mt-2">
              Verse {currentVerseIdx + 1} of {chapterContent.verses.length}
            </p>
          )}
          {isPlayingCommentary && (
            <div className="mt-2 space-y-2">
              <p className="text-sm text-amber-600 dark:text-amber-400">
                🎩 Jeeves is sharing insights...
              </p>
              {user && commentaryText && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveCommentaryAsGem}
                  disabled={savingGem}
                  className="text-xs gap-1"
                >
                  {savingGem ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Gem className="h-3 w-3" />
                      Save as Gem
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* All Verses Display - scrollable with current verse highlighted */}
        {chapterContent && chapterContent.verses.length > 0 && (
          <div className="max-h-[400px] overflow-y-auto rounded-lg border border-border/50 bg-muted/20">
            <div className="p-4 space-y-3">
              {chapterContent.verses.map((verse, idx) => {
                const isCompleted = completedVerseIndices.has(idx);
                const isCurrent = idx === currentVerseIdx;
                const isUpcoming = !isCompleted && !isCurrent;

                return (
                  <div
                    key={verse.verse}
                    id={`verse-${verse.verse}`}
                    className={`text-base leading-relaxed transition-all duration-300 rounded-md p-2 ${
                      isCompleted
                        ? "bg-green-500/20 border-l-4 border-green-500"
                        : isCurrent
                        ? "bg-primary/20 border-l-4 border-primary scale-[1.01]"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <p className="flex items-start gap-2">
                      <span className={`font-bold shrink-0 ${
                        isCompleted
                          ? "text-green-600 dark:text-green-400"
                          : isCurrent
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}>
                        {isCompleted && <Check className="inline h-4 w-4 mr-1" />}
                        {verse.verse}
                      </span>
                      <span>{verse.text}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Progress */}
        <Progress value={progressPercent} className="h-2" />

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 relative z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkipPrev}
            disabled={isLoading}
            title="Previous verse"
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            aria-label={isActive ? "Pause" : "Play"}
            className="h-12 w-12 rounded-full gradient-palace shadow-lg relative z-50 pointer-events-auto flex items-center justify-center"
            onClick={isActive ? handlePause : handlePlay}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            ) : isActive ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 ml-0.5 text-white" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkipNext}
            disabled={isLoading || currentItemIdx >= totalItems - 1}
          >
            <SkipForward className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
          >
            <Square className="h-5 w-5" />
          </Button>
        </div>

        {/* Voice Selector */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-3">
            <Mic className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground w-12">Voice</span>
            <Select value={currentVoice} onValueChange={handleVoiceChange}>
              <SelectTrigger className="flex-1 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] bg-background border-border">
                {OPENAI_VOICES.map((voice) => (
                  <SelectItem 
                    key={voice.id} 
                    value={voice.id} 
                    className="text-xs py-2.5 px-3 cursor-pointer data-[state=checked]:bg-amber-500 data-[state=checked]:text-amber-950 focus:bg-amber-500/80 focus:text-amber-950"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold">{voice.name}</span>
                      <span className="text-[10px] opacity-70">{voice.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Commentary Depth Selector */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-3">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground w-12">Depth</span>
            <Select value={currentCommentaryDepth} onValueChange={(v) => handleCommentaryDepthChange(v as "surface" | "intermediate" | "depth" | "deep-drill")}>
              <SelectTrigger className="flex-1 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="surface" className="text-xs">
                  <div className="flex flex-col">
                    <span className="font-medium">Surface</span>
                    <span className="text-muted-foreground text-[10px]">Brief overview</span>
                  </div>
                </SelectItem>
                <SelectItem value="intermediate" className="text-xs">
                  <div className="flex flex-col">
                    <span className="font-medium">Intermediate</span>
                    <span className="text-muted-foreground text-[10px]">Thorough analysis</span>
                  </div>
                </SelectItem>
                <SelectItem value="depth" className="text-xs">
                  <div className="flex flex-col">
                    <span className="font-medium">Scholarly</span>
                    <span className="text-muted-foreground text-[10px]">Deep study</span>
                  </div>
                </SelectItem>
                <SelectItem value="deep-drill" className="text-xs">
                  <div className="flex flex-col">
                    <span className="font-medium">🧠 Deep Drill</span>
                    <span className="text-muted-foreground text-[10px]">Full Palace (16+ principles)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="space-y-3 px-4">
          {/* TTS Volume (Desktop only) */}
          {!isMobile && (
            <>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8">
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <span className="text-xs text-muted-foreground w-16">Reader</span>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-10 text-right">{isMuted ? 0 : volume}%</span>
              </div>

              {/* Music volume slider */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-16 ml-10">Music</span>
                <Slider
                  value={[musicVolume]}
                  max={100}
                  step={1}
                  onValueChange={handleMusicVolumeChange}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-10 text-right">{musicVolume}%</span>
              </div>
            </>
          )}
          
          {isMobile && (
            <div className="flex flex-col gap-2 py-1 text-xs text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <Smartphone className="h-3 w-3" />
                <span>Use device volume for reader</span>
              </div>
              <div className="flex items-center gap-2 w-full py-2">
                <span className="w-12 text-right shrink-0">Music</span>
                <div className="flex-1 flex items-center justify-between gap-1" style={{ touchAction: 'manipulation' }}>
                  {[0, 10, 25, 50, 75, 100].map((pct) => (
                    <Button
                      key={pct}
                      variant={musicVolume === pct ? "default" : "outline"}
                      size="sm"
                      className="h-8 min-w-[40px] text-xs px-2"
                      style={{ touchAction: 'manipulation' }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        setMusicVolume(pct);
                        setGlobalMusicVolume(pct);
                      }}
                      onClick={() => {
                        setMusicVolume(pct);
                        setGlobalMusicVolume(pct);
                      }}
                    >
                      {pct}%
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sequence Overview */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">Up Next:</p>
          <div className="flex flex-wrap gap-1">
            {allItems.slice(currentItemIdx + 1, currentItemIdx + 6).map((item, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {item.book} {item.chapter}
              </Badge>
            ))}
            {allItems.length > currentItemIdx + 6 && (
              <Badge variant="outline" className="text-xs">
                +{allItems.length - currentItemIdx - 6} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  );
};
