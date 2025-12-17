"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  HomeIcon,
  LayoutDashboard,
  Store,
  LucideIcon,
  Box,
  Tag,
  Settings,
  Warehouse,
  LogOut,
  ChartArea,
  MonitorCog,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface IMenuItems {
  name: string;
  path: string;
  icon: LucideIcon;
  roles: ("SUPER_ADMIN" | "STORE_ADMIN")[];
}

const menuItems: IMenuItems[] = [
  {
    name: "Home",
    path: "/",
    icon: HomeIcon,
    roles: ["SUPER_ADMIN", "STORE_ADMIN"],
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "STORE_ADMIN"],
  },
  {
    name: "Store Management",
    path: "/stores",
    icon: Store,
    roles: ["SUPER_ADMIN"],
  },
  {
    name: "Edit Store Info",
    path: "/stores/edit",
    icon: MonitorCog,
    roles: ["STORE_ADMIN"],
  },
  {
    name: "Product Management",
    path: "/products",
    icon: Box,
    roles: ["SUPER_ADMIN", "STORE_ADMIN"],
  },
  {
    name: "Stock Management",
    path: "/stocks",
    icon: Warehouse,
    roles: ["SUPER_ADMIN", "STORE_ADMIN"],
  },
  {
    name: "Discount Management",
    path: "/discounts",
    icon: Tag,
    roles: ["SUPER_ADMIN", "STORE_ADMIN"],
  },
  {
    name: "Sales Report",
    path: "/reports",
    icon: ChartArea,
    roles: ["SUPER_ADMIN", "STORE_ADMIN"],
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["SUPER_ADMIN", "STORE_ADMIN"],
  },
];

export default function Sidebar() {
  const visibleMenu = menuItems.filter((item) => item.roles);
  return (
    <>
      <aside className="flex flex-col min-h-screen p-4 bg-gray-100 w-64 ">
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {visibleMenu.map((item) => (
            <Link
              href={item.path}
              key={item.name}
              className="flex items-center rounded-lg gap-2 p-2 hover:bg-gray-100 "
            >
              <item.icon />
              <span className="hover:font-semibold">{item.name}</span>
            </Link>
          ))}
        </nav>
        <button className="flex mt-4 pt-4 border-t border-gray-200 items-center gap-2 p-2 hover:bg-gray-100">
          <LogOut />
          Logout
        </button>
      </aside>
    </>
  );
}
