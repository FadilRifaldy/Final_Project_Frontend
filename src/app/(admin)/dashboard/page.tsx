"use client"
import StoreAdminDashboard from "@/components/admin/StoreAdminDashboard";
import SuperAdminDashboard from "@/components/admin/SuperAdminDashboard";
import axios from "axios";
import { useState, useEffect } from "react";

export default function DashboardPage() {
    const [role, setRole] = useState<'superAdmin' | 'storeAdmin'>('superAdmin'); //mock superAdmin dulu ntar diganti
    // useEffect(() => {
    //     const fetchRole = async () => {
    //         try {
    //             const response = await axios.get('/api/role');
    //             setRole(response.data.role);
    //         } catch (error) {
    //             console.error('Error fetching role:', error);
    //         }
    //     };
    //     fetchRole();
    // }, []);
    return (
        role === 'superAdmin' ? <SuperAdminDashboard /> : <StoreAdminDashboard />
    )
}
