import { Book } from "lucide-react";
import { ScripturePullWindow } from "./ScripturePullWindow";
import { useStudySession } from "@/contexts/StudySessionContext";

interface FloatingScriptureButtonProps {
  onInsert?: (text: string) => void;
}

export function FloatingScriptureButton({ onInsert }: FloatingScriptureButtonProps) {
  const { isSessionActive } = useStudySession();

  // Only show when in an active session OR if an onInsert handler is provided
  if (!isSessionActive && !onInsert) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 md:bottom-8">
      <ScripturePullWindow 
        onInsert={onInsert} 
        floating 
        trigger={
          <button className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center">
            <Book className="h-6 w-6" />
          </button>
        }
      />
    </div>
  );
}
