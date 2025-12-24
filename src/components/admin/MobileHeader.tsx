"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
    onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
    return (
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
            <Button
                variant="ghost"
                size="icon"
                onClick={onMenuClick}
                className="md:hidden"
                aria-label="Toggle menu"
            >
                <Menu className="h-6 w-6" />
            </Button>

            <div className="flex-1">
                <h1 className="text-lg font-semibold">Admin Panel</h1>
            </div>

            {/* Placeholder for future notification bell */}
            {/* <Button variant="ghost" size="icon">
        <Bell className="h-5 w-5" />
      </Button> */}
        </header>
    );
}
