"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInValues } from "@/lib/validations/auth";
import { supabase } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

import { toast } from "sonner";
import { loginUser } from "@/lib/helpers/auth.backend";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  async function onSubmit(values: SignInValues) {
    setLoading(true);

    const res = await loginUser({
      email: values.email,
      password: values.password,
    });

    setLoading(false);

    if (!res.success) {
      toast.error(res.message || "Login Failed");
      return;
    }

    toast.success("Login Berhasil");
    // role-based redirect
    if (res.user.role === "SUPER_ADMIN" || res.user.role === "STORE_ADMIN") {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 md:p-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center overflow-hidden">
            <Image src="/logo.png" alt="Logo" width={64} height={64} />
          </div>
          <h1 className="text-xl md:text-2xl font-bold mt-4 text-center">
            Sign In
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password..."
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-muted-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <span className="text-muted-foreground">Remember me</span>
              </div>

              <Button
                className="cursor-pointer"
                variant="link"
                onClick={() => router.push("/reset-password?mode=reset")}
              >
                Forgot password?
              </Button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full text-white bg-amber-500 hover:bg-amber-600 cursor-pointer"
            >
              {loading ? "Loading..." : "Masuk"}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-muted-foreground/20" />
              <span className="text-muted-foreground text-xs">OR</span>
              <div className="h-px flex-1 bg-muted-foreground/20" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 cursor-pointer"
              onClick={async () => {
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                  },
                });

                if (error) {
                  toast.error("Gagal login dengan Google");
                  console.error(error);
                }
              }}
            >
              <Image
                src="/images/Google.svg"
                alt="Google"
                width={20}
                height={20}
              />
              Login dengan Google
            </Button>

            {/* Register Link */}
            <p className="text-center text-sm text-muted-foreground mt-2">
              Don&apos;t have an account?{" "}
              <Link href="/signUpPage">
                <span className="text-amber-500 hover:text-amber-600 font-medium hover:underline">
                  Sign Up
                </span>{" "}
              </Link>
              here
            </p>

            {/* Back */}
            <p className="text-center text-sm text-muted-foreground mt-1">
              ←{" "}
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
