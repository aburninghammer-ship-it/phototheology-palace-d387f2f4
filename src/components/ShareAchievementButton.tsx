import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { ShareAchievementDialog } from "./ShareAchievementDialog";

interface ShareAchievementButtonProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    points: number;
  };
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ShareAchievementButton({ 
  achievement, 
  variant = "outline",
  size = "sm" 
}: ShareAchievementButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        variant={variant}
        size={size}
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      <ShareAchievementDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        achievement={achievement}
      />
    </>
  );
}
