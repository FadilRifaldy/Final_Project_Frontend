"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyToken } from "@/lib/helpers/auth.backend";
import Sidebar from "@/components/admin/Sidebar";
import MobileHeader from "@/components/admin/MobileHeader";
import DynamicBreadcrumb from "@/components/admin/DynamicBreadcrumb";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeft } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            const result = await verifyToken();

            if (!result.loggedIn) {
                // Redirect to login if not authenticated
                router.push('/signInPage?redirect=/admin/dashboard');
                return;
            }

            setIsAuthenticated(true);
            setIsLoading(false);
        }

        checkAuth();
    }, [router]);

    // Show loading spinner while checking auth
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4" />
                    <p className="text-gray-600">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    // Don't render anything if not authenticated (will redirect)
    if (!isAuthenticated) {
        return null;
    }

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