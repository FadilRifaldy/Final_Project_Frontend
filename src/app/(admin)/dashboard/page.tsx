"use client";
import StoreAdminDashboard from "@/components/admin/StoreAdminDashboard";
import SuperAdminDashboard from "@/components/admin/SuperAdminDashboard";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [role, setRole] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/auth/dashboard",
          { withCredentials: true }
        );

        setRole(response.data.user.role);
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };
    fetchRole();
  }, []);

  useEffect(() => {
    if (role === "USER") {
      router.push("/");
    }
  }, [role]);

  if (role === null) {
    return <p className="text-center p-10">Loading...</p>;
  }

  if (role === "SUPER_ADMIN") return <SuperAdminDashboard />;
  if (role === "STORE_ADMIN") return <StoreAdminDashboard />;

  return <p className="text-center p-10">Unauthorized</p>;
}
