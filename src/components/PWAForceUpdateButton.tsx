import { useState } from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { clearPwaUpdateCooldown, hardReloadApp } from "@/lib/pwa";
import { toast } from "sonner";

type Props = Omit<React.ComponentProps<typeof Button>, "onClick"> & {
  label?: string;
};

export function PWAForceUpdateButton({
  label = "Reload",
  variant = "outline",
  size = "sm",
  className,
  ...props
}: Props) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onClick = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    // Best-effort toast (page will reload quickly)
    toast.message("Reloading latest version…");

    try {
      clearPwaUpdateCooldown();
      await hardReloadApp();
    } catch {
      // hardReloadApp will still try to navigate
      setIsRefreshing(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={isRefreshing}
      className={className}
      {...props}
    >
      <RefreshCw className={"h-4 w-4" + (isRefreshing ? " animate-spin" : "")} />
      {label && <span className="sr-only sm:not-sr-only">{label}</span>}
    </Button>
  );
}
