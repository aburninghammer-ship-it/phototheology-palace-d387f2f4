import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search, BookOpen, Gamepad2, Users, Trophy, BookMarked } from "lucide-react";
import { Button } from "./ui/button";

const searchItems = [
  // Study
  { title: "Bible Reader", path: "/bible", icon: BookOpen, category: "Study" },
  { title: "Memory Palace", path: "/palace", icon: BookMarked, category: "Study" },
  { title: "Revelation Course", path: "/revelation-course", icon: BookOpen, category: "Study" },
  { title: "Daniel Course", path: "/daniel-course", icon: BookOpen, category: "Study" },
  { title: "Phototheology Course", path: "/phototheology-course", icon: BookOpen, category: "Study" },
  
  // Practice
  { title: "Training Drills", path: "/training-drills", icon: Trophy, category: "Practice" },
  { title: "Flashcards", path: "/flashcards", icon: BookOpen, category: "Practice" },
  { title: "Memorization Verses", path: "/memorization-verses", icon: BookMarked, category: "Practice" },
  
  // Games
  { title: "Escape Rooms", path: "/escape-room", icon: Gamepad2, category: "Games" },
  { title: "Chain Chess", path: "/chain-chess", icon: Gamepad2, category: "Games" },
  { title: "Treasure Hunt", path: "/treasure-hunt", icon: Gamepad2, category: "Games" },
  { title: "Monthly Games", path: "/games", icon: Gamepad2, category: "Games" },
  
  // Community
  { title: "Community Forum", path: "/community", icon: Users, category: "Community" },
  { title: "Live Study", path: "/live-study", icon: Users, category: "Community" },
  { title: "Leaderboard", path: "/leaderboard", icon: Trophy, category: "Community" },
];

export const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:inline">Search...</span>
        <kbd className="hidden md:inline pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for features, courses, games..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {["Study", "Practice", "Games", "Community"].map((category) => (
            <CommandGroup key={category} heading={category}>
              {searchItems
                .filter((item) => item.category === category)
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={item.path}
                      onSelect={() => handleSelect(item.path)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};
