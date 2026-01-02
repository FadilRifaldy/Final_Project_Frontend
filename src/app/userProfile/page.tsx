"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getMe } from "@/lib/helpers/auth.backend";
import { sendVerifyEmail } from "@/lib/helpers/auth.backend";
import { updateProfile } from "@/lib/helpers/auth.backend";
import { getCloudinarySignature } from "@/lib/helpers/auth.backend";
import { uploadToCloudinary } from "@/lib/helpers/auth.backend";
import { IUser } from "@/types/user";

import { ArrowLeft } from "lucide-react";
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
  Smartphone,
  MailWarning,
} from "lucide-react";
import AddressList from "@/components/address/address-list";

export default function UserProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<IUser | null>(null);
  const [initialUser, setInitialUser] = useState<IUser | null>(null);
  const [originalEmail, setOriginalEmail] = useState("");
  const [emailChanged, setEmailChanged] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingVerify, setSendingVerify] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

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
      setInitialUser(res.user);
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

  const handleCancel = () => {
    if (!initialUser) return;

    setUser(initialUser);
    setPhone(initialUser.phone || "");
    setOriginalEmail(initialUser.email);
    setEmailChanged(false);

    toast.info("Perubahan dibatalkan");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Format gambar harus JPG, JPEG, PNG, atau GIF");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 1MB");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      const signature = await getCloudinarySignature();

      const imageUrl = await uploadToCloudinary(
        avatarFile,
        signature,
        setUploadProgress
      );

      const res = await updateProfile({
        name: user.name,
        email: user.email,
        phone,
        profileImage: imageUrl,
      });

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success("Foto profil berhasil diperbarui");

      // refresh user
      setUser((prev) => (prev ? { ...prev, profileImage: imageUrl } : prev));

      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Terjadi kesalahan tidak terduga");
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start p-6 bg-muted/30">
      <Card className="w-full max-w-2xl shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="rounded-full p-2 hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <User className="w-5 h-5" />
            User Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={
                  avatarPreview ||
                  user.profileImage ||
                  "/avatar-placeholder.png"
                }
              />
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Profile Picture
              </Label>

              <Input
                className="cursor-pointer"
                type="file"
                accept=".jpg,.jpeg,.png,.gif"
                onChange={handleAvatarChange}
                disabled={uploading}
              />
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, JPEG, PNG, GIF · Max size: 1 MB
              </p>

              {avatarFile && (
                <Button
                  size="sm"
                  onClick={handleUploadAvatar}
                  disabled={uploading}
                >
                  {uploading ? `Mengupload ${uploadProgress}%` : "Upload Foto"}
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Name
              </Label>
              <Input
                placeholder="Enter your full name"
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
                disabled={user.provider === "GOOGLE"}
                value={user.email}
                onChange={(e) => {
                  const newEmail = e.target.value;
                  setUser({ ...user, email: newEmail });
                  setEmailChanged(newEmail !== originalEmail);
                }}
              />
            </div>
          </div>

          {emailChanged && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-700">
              <MailWarning className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                Changing your email will require re-verification and a new
                login.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              placeholder="e.g. +62 8xxxxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">
                Email Status: {user.isVerified ? "Verified" : "Unverified"}
              </span>
            </div>

            {!user.isVerified && (
              <Button
                className="cursor-pointer"
                variant="outline"
                size="sm"
                disabled={sendingVerify}
                onClick={handleSendVerifyEmail}
              >
                {sendingVerify
                  ? "Sending..."
                  : emailChanged
                  ? "Resend Verification Email"
                  : "Send Verification Email"}
              </Button>
            )}
          </div>

          <AddressList />

          <div className="p-4 rounded-xl border bg-muted/40">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Referral Code</span>
              <span className="font-mono text-sm bg-white px-3 py-1 rounded border">
                {user.referralCode}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Share this code with friends to earn rewards
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Account Security
            </h3>

            <p className="text-sm text-muted-foreground">
              For security reasons, password changes are handled via email.
            </p>

            <Button
              className="cursor-pointer"
              disabled={user.provider === "GOOGLE"}
              variant="outline"
              onClick={() => router.push("/reset-password?mode=change")}
            >
              Change Password
            </Button>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              onClick={handleSaveProfile}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
