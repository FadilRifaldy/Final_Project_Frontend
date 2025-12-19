"use client";

import axios from "axios";
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
import { menuItems, type IMenuItems } from "./SidebarMenu";

export default function Sidebar() {
  const [role, setRole] = useState<string>("");
  const [user, setUser] = useState<{
    name: string;
    email: string;
    profileImage?: string | null;
  } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Ambil data user dari backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/auth/dashboard",
          { withCredentials: true }
        );
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
      await axios.post(
        "http://localhost:8800/auth/logout",
        {},
        { withCredentials: true }
      );
      router.push("/signInPage");
    } catch (error) {
      console.error("Error logging out:", error);
      router.push("/signInPage");
    }
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Header/Branding dengan User Info */}
      <div className="flex flex-col border-b border-sidebar-border">
        <div className="flex h-16 items-center px-6">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </div>
        {user && (
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
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {visibleMenu.map((item) => {
          const isActive = pathname === item.path;
          const hasChildren = item.children && item.children.length > 0;
          const isChildActive = hasActiveChild(item);

          // Jika menu punya children, render sebagai collapsible
          if (hasChildren) {
            return (
              <Collapsible
                key={item.name}
                defaultOpen={isChildActive}
                className="group"
              >
                <CollapsibleTrigger
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive || isChildActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
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
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          isChildPathActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
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
          return (
            <Link
              href={item.path || "#"}
              key={item.name}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
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
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
