"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import MobileHeader from "@/components/admin/MobileHeader";
import DynamicBreadcrumb from "@/components/admin/DynamicBreadcrumb";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeft } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <MobileHeader onMenuClick={() => setIsMobileOpen(true)} />

            <Sidebar
                isMobileOpen={isMobileOpen}
                onMobileClose={() => setIsMobileOpen(false)}
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />

            <main className="flex-1 overflow-auto">
                {/* Desktop Toggle Button & Breadcrumb */}
                <div className="hidden md:flex sticky top-0 z-30 bg-background border-b items-center gap-4 px-4 h-14">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="h-8 w-8 flex-shrink-0"
                    >
                        {isCollapsed ? (
                            <PanelLeft className="h-4 w-4" />
                        ) : (
                            <PanelLeftClose className="h-4 w-4" />
                        )}
                    </Button>

                    <DynamicBreadcrumb />
                </div>

                {children}
            </main>
        </div>
    );
}