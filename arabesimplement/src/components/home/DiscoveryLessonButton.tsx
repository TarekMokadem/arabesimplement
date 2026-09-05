"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { openDiscoveryLesson } from "@/lib/discovery-lesson";

type Variant = "header" | "headerCompact" | "menu" | "footer";

const styles: Record<Variant, string> = {
  header:
    "hidden h-9 shrink-0 px-3.5 xl:inline-flex bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground",
  headerCompact:
    "xl:hidden h-8 shrink-0 px-2 text-xs bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground",
  menu: "w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground",
  footer:
    "mt-4 w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-white hover:text-primary",
};

export function DiscoveryLessonButton({
  variant,
  className,
  onOpened,
}: {
  variant: Variant;
  className?: string;
  onOpened?: () => void;
}) {
  return (
    <Button
      type="button"
      className={cn(styles[variant], className)}
      onClick={() => {
        openDiscoveryLesson();
        onOpened?.();
      }}
    >
      <Sparkles className="mr-1.5 h-3.5 w-3.5" />
      Cours découverte
    </Button>
  );
}
