import { Home, BookOpen, Building2, Gamepad2, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: BookOpen, label: "Bible", path: "/bible" },
  { icon: Building2, label: "Palace", path: "/palace" },
  { icon: Gamepad2, label: "Games", path: "/games" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  
  // Don't show on landing page or auth pages when not logged in
  if (!user) return null;
  
  // Don't show on certain pages
  const hiddenPaths = ["/auth", "/onboarding", "/interactive-demo"];
  if (hiddenPaths.some(path => location.pathname.startsWith(path))) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span className={cn(
                "text-xs font-medium",
                isActive && "text-primary"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
