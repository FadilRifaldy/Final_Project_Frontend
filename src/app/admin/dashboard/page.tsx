"use client";
import StoreAdminDashboard from "@/components/admin/StoreAdminDashboard";
import SuperAdminDashboard from "@/components/admin/SuperAdminDashboard";
import api from "@/lib/api/axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProgressBar } from "@/hooks/useProgressBar";
import { LoadingScreen } from "@/components/ui/loading-screen";

export default function DashboardPage() {
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const progress = useProgressBar(loading);
  const router = useRouter();

  // render role dari backend
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await api.get('/auth/dashboard');
        setRole(response.data.user.role);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching role:", error);
        // If 401/403 (unauthenticated), redirect to login
        router.push("/signInPage");
      }
    };
    fetchRole();
  }, [router]);

  // Handle redirect based on Role
  useEffect(() => {
    if (!loading && role) {
      if (role === "CUSTOMER") {
        router.push("/unauthorized");
      }
    }
  }, [role, loading, router]);

  // Show loading with progress bar
  if (loading) {
    return <LoadingScreen progress={progress} message="Loading dashboard..." />;
  }

  if (role === "SUPER_ADMIN") return <SuperAdminDashboard />;
  if (role === "STORE_ADMIN") return <StoreAdminDashboard />;

  return null;
}
