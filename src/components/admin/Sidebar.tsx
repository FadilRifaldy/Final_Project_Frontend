"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { LayoutDashboard, Store, LucideIcon, Box, Tag, BarChart, Settings, Warehouse, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface IMenuItems {
    name: string;
    path: string;
    icon: LucideIcon;
    roles: ('superAdmin' | 'storeAdmin')[];
}

const menuItems: IMenuItems[] = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
        roles: ['superAdmin', 'storeAdmin'],
    },
    {
        name: 'Pengaturan Toko',
        path: '/stores',
        icon: Store,
        roles: ['superAdmin', 'storeAdmin'],
    },
    {
        name: 'Kelola Produk',
        path: '/products',
        icon: Box,
        roles: ['superAdmin', 'storeAdmin'],
    },
    {
        name: 'Kelola Stok',
        path: '/stocks',
        icon: Warehouse,
        roles: ['superAdmin', 'storeAdmin'],
    },
    {
        name: 'Kelola Diskon',
        path: '/discounts',
        icon: Tag,
        roles: ['superAdmin', 'storeAdmin'],
    },
    {
        name: 'Laporan Penjualan',
        path: '/reports',
        icon: BarChart,
        roles: ['superAdmin', 'storeAdmin'],
    },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['superAdmin', 'storeAdmin'] },
];

export default function Sidebar() {
    const currentRole = "storeAdmin"; // mock data role user

    const visibleMenu = menuItems.filter((item) => item.roles.includes(currentRole));
    return (
        <aside className="flex flex-col h-screen p-4 bg-gray-100 w-64 ">

            <div className="flex items-center gap-2 mb-6 pb-4 ">
                <Image src="/logo.png" alt="Logo" width={50} height={50} />
            </div>
            <nav className="flex flex-col gap-2 flex-1">
                {visibleMenu.map((item) => (
                    <Link href={item.path} key={item.name} className="flex items-center rounded-lg gap-2 p-2 hover:bg-gray-100">
                        <item.icon />
                        {item.name}
                    </Link>
                ))}
            </nav>
            <footer className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 p-2 hover:bg-gray-100">
                    <LogOut />
                    Logout
                </button>
            </footer>
        </aside>
    )
}