"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { signupSchema, SignUpValues } from "@/lib/validations/auth";
import { signUpUser, signUpStoreAdmin } from "@/lib/helpers/auth.backend";
import { SignUpCard } from "@/components/signup/signup-card";

type SignUpRole = "CUSTOMER" | "STORE_ADMIN";

export default function SignUpPage() {
  const [role, setRole] = useState<SignUpRole>("CUSTOMER");
  const [hasReferral, setHasReferral] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      referralCode: "",
    },
  });

  async function onSubmit(values: SignUpValues): Promise<void> {
    setLoading(true);

    try {
      const res =
        role === "CUSTOMER"
          ? await signUpUser(values)
          : await signUpStoreAdmin({
              name: values.name,
              email: values.email,
              password: values.password,
            });

      toast.success(res.message);
      router.push("/signInPage");
    } catch {
      toast.error("Register gagal");
    } finally {
      setLoading(false);
    }
  }

  const switchRole = (newRole: SignUpRole) => {
    setRole(newRole);
    setHasReferral(false);
    form.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4">
      <SignUpCard
        role={role}
        hasReferral={hasReferral}
        setHasReferral={setHasReferral}
        loading={loading}
        form={form}
        onSubmit={onSubmit}
        onSwitchRole={switchRole}
      />
    </div>
  );
}