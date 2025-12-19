import { Button } from "@/components/ui/button";
import { useGuestMode } from "@/hooks/useGuestMode";
import { useNavigate } from "react-router-dom";
import { Play, Sparkles } from "lucide-react";

interface GuestTryButtonProps {
  destination: string;
  featureName: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

export const GuestTryButton = ({
  destination,
  featureName,
  className = "",
  variant = "outline",
  size = "default",
  children,
}: GuestTryButtonProps) => {
  const { setGuestMode, trackFeatureUsed } = useGuestMode();
  const navigate = useNavigate();
  
  const handleTry = () => {
    setGuestMode(true);
    trackFeatureUsed(featureName);
    navigate(destination);
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleTry}
      className={className}
    >
      {children || (
        <>
          <Play className="w-4 h-4 mr-2" />
          Try {featureName}
        </>
      )}
    </Button>
  );
};

// Quick access button for hero sections
export const GuestQuickStart = () => {
  const { setGuestMode, trackFeatureUsed } = useGuestMode();
  const navigate = useNavigate();
  
  const startGuestMode = () => {
    setGuestMode(true);
    trackFeatureUsed("Quick Demo");
    navigate("/interactive-demo");
  };
  
  return (
    <Button
      size="lg"
      variant="outline"
      onClick={startGuestMode}
      className="border-primary/50 hover:bg-primary/10"
    >
      <Sparkles className="w-5 h-5 mr-2" />
      Try Without Signup
    </Button>
  );
};
