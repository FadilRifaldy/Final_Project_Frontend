"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { sendPassLinkEmail } from "@/lib/helpers/auth.backend";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { Mail } from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "change" ? "change" : "reset";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email wajib diisi");
      return;
    }

    try {
      setLoading(true); // 🔥 START LOADING

      const res = await sendPassLinkEmail({
        email,
        mode,
      });

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success("Link reset password telah dikirim ke email Anda");
    } catch (error) {
      toast.error("Terjadi kesalahan, silakan coba lagi");
    } finally {
      setLoading(false); // 🔥 STOP LOADING (PASTI JALAN)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Reset Password
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Masukkan email yang terdaftar. Kami akan mengirimkan link untuk
            mereset password Anda.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="contoh@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600"
              disabled={loading}
            >
              {loading ? "Mengirim..." : "Kirim Link Reset Password"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            <Link href="/signInPage" className="hover:underline">
              ← Kembali ke Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
