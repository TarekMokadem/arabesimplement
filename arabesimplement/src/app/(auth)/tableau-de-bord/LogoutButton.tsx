"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "../actions";

export function LogoutButton() {
  return (
    <form action={signOut}>
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="text-gray-300 hover:text-white hover:bg-white/10"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </form>
  );
}
