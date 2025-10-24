import { Building2 } from "lucide-react";
import { Progress } from "./ui/progress";

interface LoadingScreenProps {
  message?: string;
  progress?: number;
}

export const LoadingScreen = ({ message = "Loading...", progress }: LoadingScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="relative">
            <Building2 className="h-16 w-16 text-primary animate-pulse" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Phototheology</h2>
          <p className="text-muted-foreground">{message}</p>
        </div>

        {progress !== undefined && (
          <div className="space-y-2">
            <Progress value={progress} className="w-64 mx-auto" />
            <p className="text-sm text-muted-foreground">{progress}%</p>
          </div>
        )}
      </div>
    </div>
  );
};
