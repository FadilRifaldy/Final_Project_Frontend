"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { socialLogin } from "@/lib/helpers/auth.backend";

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

      const res = await socialLogin(session.access_token);

      if (!res.success) {
        toast.error(res.message ?? "Login Google gagal");
        router.replace("/signInPage");
        return;
      }

      toast.success("Login Google berhasil");

      // 🔥 INI KUNCI UTAMA
      router.refresh();   // ⬅️ paksa Navbar fetch ulang user
      router.replace("/");
    };

    handleLogin();
  }, [router]);

  return <p className="text-center mt-20">Memproses login Google...</p>;
}
