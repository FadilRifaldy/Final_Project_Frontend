"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getMe } from "@/lib/helpers/auth.backend";
import { sendVerifyEmail } from "@/lib/helpers/auth.backend";
import { updateProfile } from "@/lib/helpers/auth.backend";
import { IUser } from "@/types/user";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Mail,
  User,
  Lock,
  Image as ImageIcon,
  ShieldCheck,
} from "lucide-react";

export default function UserProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<IUser | null>(null);
  const [originalEmail, setOriginalEmail] = useState("");
  const [emailChanged, setEmailChanged] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingVerify, setSendingVerify] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      const res = await getMe();

      if (!mounted) return;

      if (!res.success) {
        router.replace("/signInPage");
        return;
      }

      setUser(res.user);
      setOriginalEmail(res.user.email);
      setPhone(res.user.phone || "");
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (!user) return null;

  const handleSaveProfile = async () => {
    setLoading(true);

    const res = await updateProfile({
      name: user.name,
      email: user.email,
      phone,
    });

    setLoading(false);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(
      emailChanged
        ? "Email berubah. Silakan verifikasi email baru dan login kembali."
        : "Profil berhasil diperbarui"
    );

    if (emailChanged) {
      setTimeout(() => {
        router.replace("/signInPage");
      }, 1500);
      return;
    }

    const refreshed = await getMe();
    if (refreshed.success) {
      setUser(refreshed.user);
      setOriginalEmail(refreshed.user.email);
      setEmailChanged(false);
      setPhone(refreshed.user.phone || "");
    }
  };

  const handleSendVerifyEmail = async () => {
    setSendingVerify(true);

    const res = await sendVerifyEmail();

    setSendingVerify(false);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success("Email verifikasi dikirim. Silakan cek inbox.");
  };

  return (
    <div className="min-h-screen flex justify-center items-start p-6 bg-muted/30">
      <Card className="w-full max-w-2xl shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <User className="w-5 h-5" />
            User Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/avatar-placeholder.png" />
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Upload Foto Profil
              </Label>
              <Input type="file" accept=".jpg,.jpeg,.png" disabled />
              <p className="text-xs text-muted-foreground">
                (Belum diimplementasikan)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Nama
              </Label>
              <Input
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                value={user.email}
                onChange={(e) => {
                  const newEmail = e.target.value;
                  setUser({ ...user, email: newEmail });
                  setEmailChanged(newEmail !== originalEmail);
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">📞 Nomor Telepon</Label>
            <Input
              placeholder="08xxxxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {emailChanged && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-700">
              ⚠️ Mengubah email akan membuat akun perlu diverifikasi ulang dan
              kamu harus login kembali.
            </div>
          )}

          <div className="flex items-center justify-between p-4 rounded-xl border">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">
                Status Email:{" "}
                {user.isVerified ? "Terverifikasi" : "Belum Terverifikasi"}
              </span>
            </div>

            {!user.isVerified && (
              <Button
                variant="outline"
                size="sm"
                disabled={sendingVerify}
                onClick={handleSendVerifyEmail}
              >
                {sendingVerify
                  ? "Mengirim..."
                  : emailChanged
                  ? "Kirim Ulang Email Verifikasi"
                  : "Kirim Email Verifikasi"}
              </Button>
            )}
          </div>

          <div className="p-4 rounded-xl border bg-muted/40">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Referral Code</span>
              <span className="font-mono text-sm bg-white px-3 py-1 rounded border">
                {user.referralCode}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Bagikan kode ini ke teman untuk mendapatkan reward 🎁
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Ganti Password
            </h3>

            <Input type="password" placeholder="Password lama" disabled />
            <Input type="password" placeholder="Password baru" disabled />
            <Input
              type="password"
              placeholder="Konfirmasi password baru"
              disabled
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => router.refresh()}>
              Batal
            </Button>
            <Button onClick={handleSaveProfile} disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
