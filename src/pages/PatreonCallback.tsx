import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function PatreonCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        toast.error("Patreon connection cancelled");
        navigate("/auth?patreon=true");
        return;
      }

      if (!code) {
        toast.error("No authorization code received");
        navigate("/auth?patreon=true");
        return;
      }

      try {
        const redirectUri = `${window.location.origin}/patreon-callback`;
        
        const { data, error: fnError } = await supabase.functions.invoke("patreon-callback", {
          body: {
            code,
            redirectUri,
            userId: user?.id,
          },
        });

        if (fnError) throw fnError;

        if (data.isActivePatron) {
          toast.success(`Welcome, ${data.patreonName}! Your Patron benefits are now active.`);
          navigate("/dashboard");
        } else {
          toast.info("Connected to Patreon, but no active patronage found. Consider becoming a Patron for full access!");
          navigate("/auth?patreon=true");
        }
      } catch (err) {
        console.error("Patreon callback error:", err);
        toast.error("Failed to connect Patreon account");
        navigate("/auth?patreon=true");
      } finally {
        setProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, user, navigate]);

  return <LoadingScreen message="Connecting your Patreon account..." />;
}
