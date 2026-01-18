"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { setPassSchema, setPassValues } from "@/lib/validations/auth";

import {
  checkPasswordToken,
  confirmResetPassword,
} from "@/lib/helpers/auth.backend";

import { useForm } from "react-hook-form";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

export default function ConfirmPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [checkingToken, setCheckingToken] = useState(true);
  const [requireOldPassword, setRequireOldPassword] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const form = useForm<setPassValues>({
    resolver: zodResolver(setPassSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
    },
  });

  // =====================
  // Validate token & detect mode
  // =====================
  useEffect(() => {
    if (!token) {
      toast.error("Token tidak valid");
      router.replace("/signInPage");
      return;
    }

    const checkToken = async () => {
      const res = await checkPasswordToken(token);

      if (!res.valid) {
        toast.error(res.message);
        router.replace("/signInPage");
        return;
      }

      setRequireOldPassword(res.requireOldPassword);
      setCheckingToken(false);
    };

    checkToken();
  }, [token, router]);

  // =====================
  // Submit password
  // =====================
  const handleSubmit = async () => {
    const isValid = await form.trigger("password");
    if (!isValid) return;

    if (requireOldPassword && !oldPassword) {
      toast.error("Password lama wajib diisi");
      return;
    }

    if (!confirmPassword) {
      toast.error("Konfirmasi password wajib diisi");
      return;
    }

    if (form.getValues("password") !== confirmPassword) {
      toast.error("Konfirmasi password tidak sama");
      return;
    }

    if (!token) return;

    setLoading(true);

    const res = await confirmResetPassword({
      token,
      oldPassword: requireOldPassword ? oldPassword : undefined,
      newPassword: form.getValues("password"),
    });

    setLoading(false);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success("Password berhasil diperbarui. Silakan login kembali.");

    setTimeout(() => {
      router.replace("/signInPage");
    }, 1500);
  };

  if (checkingToken) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Reset Password
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {requireOldPassword && (
            <div className="space-y-2">
              <Label>Password Lama</Label>
              <Input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Password Baru</Label>
            <Input type="password" {...form.register("password")} />

            {form.formState.errors.password && (
              <p className="text-xs text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Konfirmasi Password Baru</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-amber-500 hover:bg-amber-600"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Simpan Password"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
