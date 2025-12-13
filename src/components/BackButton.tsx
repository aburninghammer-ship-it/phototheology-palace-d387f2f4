import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on dashboard/home page
  if (location.pathname === "/" || location.pathname === "/dashboard") {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(-1)}
      className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">Back</span>
    </Button>
  );
};
