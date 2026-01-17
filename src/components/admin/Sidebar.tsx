"use client";

import api from "@/lib/api/axios";
import { useEffect, useState } from "react";
import { LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { menuItems, type IMenuItems } from "./SidebarMenu";

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  isMobileOpen = false,
  onMobileClose,
  isCollapsed = false,
  onToggleCollapse
}: SidebarProps) {
  const [role, setRole] = useState<string>("");
  const [user, setUser] = useState<{
    name: string;
    email: string;
    profileImage?: string | null;
  } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // State untuk collapsible menus (persist di localStorage)
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-open-menus");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // Save ke localStorage setiap kali openMenus berubah
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-open-menus", JSON.stringify(openMenus));
    }
  }, [openMenus]);

  // Toggle menu open/close
  const toggleMenu = (menuName: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  // Ambil data user dari backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/auth/dashboard");
        const userData = response.data.user;
        setRole(userData.role);
        setUser({
          name: userData.name || "Admin",
          email: userData.email || "",
          profileImage: userData.profileImage || null,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  // Helper untuk generate initial dari nama
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Filter menu berdasarkan role
  const visibleMenu = menuItems.filter((item) =>
    item.roles.includes(role as "SUPER_ADMIN" | "STORE_ADMIN")
  );

  // Check apakah ada child menu yang aktif
  const hasActiveChild = (item: IMenuItems) => {
    if (!item.children) return false;
    return item.children.some((child) => pathname === child.path);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {});
      router.push("/signInPage");
    } catch (error) {
      console.error("Error logging out:", error);
      router.push("/signInPage");
    }
  };

  // Sidebar content component (reusable for both mobile and desktop)
  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <>
      {/* Header/Branding dengan User Info */}
      <div className="flex flex-col border-b border-sidebar-border">
        <div className={cn("flex h-16 items-center", collapsed ? "justify-center px-2" : "px-6")}>
          {!collapsed && <h2 className="text-lg font-semibold">Admin Panel</h2>}
          {collapsed && <h2 className="text-lg font-semibold">AP</h2>}
        </div>
        {user && !collapsed && (
          <div className="flex items-center gap-3 px-6 pb-4">
            <Avatar className="h-10 w-10">
              {user.profileImage && (
                <AvatarImage src={user.profileImage} alt={user.name} />
              )}
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}
        {user && collapsed && (
          <div className="flex items-center justify-center px-2 pb-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-10 w-10">
                  {user.profileImage && (
                    <AvatarImage src={user.profileImage} alt={user.name} />
                  )}
                  <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {visibleMenu.map((item) => {
          const isActive = pathname === item.path;
          const hasChildren = item.children && item.children.length > 0;
          const isChildActive = hasActiveChild(item);

          // Jika menu punya children, render sebagai collapsible
          if (hasChildren) {
            if (collapsed) {
              // Collapsed mode: Show icon with tooltip
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "flex items-center justify-center rounded-lg p-2 text-sm font-medium transition-colors cursor-pointer",
                        isActive || isChildActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-amber-500/10 hover:text-amber-600"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                    {item.children && (
                      <div className="mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            href={child.path}
                            onClick={onMobileClose}
                            className="block text-xs hover:underline"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <Collapsible
                key={item.name}
                open={openMenus[item.name] ?? isChildActive}
                onOpenChange={() => toggleMenu(item.name)}
                className="group"
              >
                <CollapsibleTrigger
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive || isChildActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-amber-500/10 hover:text-amber-600"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1 space-y-1 pl-4">
                  {item.children?.map((child) => {
                    const isChildPathActive = pathname === child.path;
                    return (
                      <Link
                        key={child.path}
                        href={child.path}
                        onClick={onMobileClose}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          isChildPathActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground/60 hover:bg-amber-500/10 hover:text-amber-600"
                        )}
                      >
                        {child.icon && <child.icon className="h-4 w-4" />}
                        <span>{child.name}</span>
                      </Link>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          }

          // Menu biasa tanpa children
          if (collapsed) {
            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.path || "#"}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center justify-center rounded-lg p-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-amber-500/10 hover:text-amber-600"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <Link
              href={item.path || "#"}
              key={item.name}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-amber-500/10 hover:text-amber-600"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer/Logout */}
      <div className="border-t border-sidebar-border p-4">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center rounded-lg p-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-amber-500/10 hover:text-amber-600"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-amber-500/10 hover:text-amber-600"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </>
  );

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile Drawer */}
      <Sheet open={isMobileOpen} onOpenChange={onMobileClose}>
        <SheetContent
          side="left"
          className="w-64 p-0 md:hidden"
        >
          <VisuallyHidden>
            <SheetTitle>Navigation Menu</SheetTitle>
          </VisuallyHidden>
          <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent collapsed={isCollapsed} />
      </aside>
    </TooltipProvider>
  );
}
