"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IUser } from "@/types/user";
import {
  getMe,
  sendVerifyEmail,
  updateProfile,
  getCloudinarySignature,
  uploadToCloudinary,
} from "@/lib/helpers/auth.backend";

import { ArrowLeft, User, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import AvatarSection from "@/components/userProfile/avatar-section";
import PersonalInfoSection from "@/components/userProfile/personal-info-section";
import VerificationAlert from "@/components/userProfile/verification-alert";
import AddressList from "@/components/address/address-list";
import ReferralCard from "@/components/userProfile/referral-card";
import SecuritySection from "@/components/userProfile/security-section";

export default function UserProfilePage() {
  const router = useRouter();

  // User State
  const [user, setUser] = useState<IUser | null>(null);
  const [initialUser, setInitialUser] = useState<IUser | null>(null);
  const [originalEmail, setOriginalEmail] = useState("");
  const [emailChanged, setEmailChanged] = useState(false);
  const [phone, setPhone] = useState("");

  // Loading States
  const [loading, setLoading] = useState(false);
  const [sendingVerify, setSendingVerify] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Avatar States
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  // Fetch User Data
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
      setPageLoading(false);
    };

    fetchUser();
    return () => {
      mounted = false;
    };
  }, [router]);

  // Handle Save Profile
  const handleSaveProfile = async () => {
    if (!user) return;

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
      setTimeout(() => router.replace("/signInPage"), 1500);
      return;
    }

    const refreshed = await getMe();
    if (refreshed.success) {
      setUser(refreshed.user);
      setInitialUser(refreshed.user);
      setOriginalEmail(refreshed.user.email);
      setEmailChanged(false);
      setPhone(refreshed.user.phone || "");
    }
  };

  // Handle Send Verification Email
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

  // Handle Cancel Changes
  const handleCancel = () => {
    if (!initialUser) return;

    setUser(initialUser);
    setPhone(initialUser.phone || "");
    setOriginalEmail(initialUser.email);
    setEmailChanged(false);
    setAvatarFile(null);
    setAvatarPreview(null);

    toast.info("Perubahan dibatalkan");
  };

  // Handle Avatar Change
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

  // Handle Upload Avatar
  const handleUploadAvatar = async () => {
    if (!avatarFile || !user) return;

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
      setUser((prev) => (prev ? { ...prev, profileImage: imageUrl } : prev));
      setInitialUser((prev) =>
        prev ? { ...prev, profileImage: imageUrl } : prev
      );
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Loading State
  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/50">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-slate-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const hasChanges =
    user.name !== initialUser?.name ||
    user.email !== initialUser?.email ||
    phone !== (initialUser?.phone || "");

  return (
    <div className="min-h-screen flex justify-center items-start py-3 sm:py-4 md:py-6 px-3 sm:px-4 md:px-6 bg-gradient-to-br from-slate-50 to-slate-100/50">
      <Card className="w-full max-w-3xl shadow-lg border-slate-200 mb-6 sm:mb-8">
        {/* Header */}
        <CardHeader className="border-b border-slate-100 bg-white/80 backdrop-blur p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full hover:bg-slate-100 h-8 w-8 sm:h-10 sm:w-10"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base sm:text-xl truncate">
                  User Profile
                </CardTitle>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
                  Manage your account information
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          {/* Avatar Section */}
          <AvatarSection
            user={user}
            avatarPreview={avatarPreview}
            avatarFile={avatarFile}
            uploading={uploading}
            uploadProgress={uploadProgress}
            onAvatarChange={handleAvatarChange}
            onUploadAvatar={handleUploadAvatar}
          />

          {/* Personal Info Section */}
          <PersonalInfoSection
            user={user}
            phone={phone}
            emailChanged={emailChanged}
            originalEmail={originalEmail}
            onUserChange={setUser}
            onPhoneChange={setPhone}
            onEmailChange={setEmailChanged}
          />

          {/* Verification Alert */}
          {!user.isVerified && (
            <VerificationAlert
              sendingVerify={sendingVerify}
              onSendVerify={handleSendVerifyEmail}
            />
          )}

          {/* Address List */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-sm font-semibold text-slate-700">
              Delivery Addresses
            </h3>
            <AddressList />
          </div>

          {/* Referral Card */}
          <ReferralCard referralCode={user.referralCode} />

          {/* Security Section */}
          <SecuritySection
            provider={user.provider}
            onChangePassword={() => router.push("/reset-password?mode=change")}
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={loading || !hasChanges}
              className="w-full sm:w-auto text-sm h-10"
            >
              Cancel Changes
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={loading || !hasChanges}
              className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow text-sm h-10"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
