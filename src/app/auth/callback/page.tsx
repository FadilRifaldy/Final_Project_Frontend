"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { socialLogin } from "@/lib/helpers/auth.backend";

// Prevent prerendering - this page needs to run only on the client
export const dynamic = "force-dynamic";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/signInPage");
        return;
      }

      const role =
        (typeof window !== "undefined" &&
          localStorage.getItem("signup_role")) as
        | "CUSTOMER"
        | "STORE_ADMIN"
        | null;

      const res = await socialLogin(
        session.access_token,
        role ?? "CUSTOMER"
      );

      localStorage.removeItem("signup_role");

      if (!res.success) {
        toast.error(res.message ?? "Login Google gagal");
        router.replace("/signInPage");
        return;
      }
      
      if (res.token) {
        localStorage.setItem("authToken", res.token);
      }

      toast.success("Login Google berhasil");

      if (
        res.user?.role === "SUPER_ADMIN" ||
        res.user?.role === "STORE_ADMIN"
      ) {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/");
      }

      router.refresh();
    };

    handleLogin();
  }, [router]);

  return (
    <p className="flex justify-center items-center text-center mt-80 text-slate-600">
      Memproses login Google...
    </p>
  );
}
