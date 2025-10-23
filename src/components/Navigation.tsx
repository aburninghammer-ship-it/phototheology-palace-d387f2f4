import { Link, useLocation } from "react-router-dom";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-elegant">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Building2 className="h-6 w-6 text-accent transition-smooth group-hover:text-accent/80" />
            <span className="font-serif text-xl font-semibold">Phototheology</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              asChild
              size="sm"
            >
              <Link to="/">Home</Link>
            </Button>
            <Button
              variant={location.pathname === "/palace" ? "default" : "ghost"}
              asChild
              size="sm"
            >
              <Link to="/palace">The Palace</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
