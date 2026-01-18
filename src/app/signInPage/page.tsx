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
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

import { toast } from "sonner";
import { loginUser } from "@/lib/helpers/auth.backend";

// Prevent prerendering - this page uses Supabase client
export const dynamic = "force-dynamic";

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

    if (res.user.role === "SUPER_ADMIN" || res.user.role === "STORE_ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 py-6">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-7">
          {/* Logo & Title */}
          <div className="flex flex-col items-center mb-5">
            <div className="w-auto h-24 flex items-center justify-center mb-4">
              <Image
                src="/grosirin-auth-amber.svg"
                alt="EasyBite Logo"
                width={96}
                height={96}
                className="w-auto h-full object-contain rounded-2xl shadow-sm"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mt-3 text-slate-900">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to continue to your account
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email..."
                        {...field}
                        className="h-10 sm:h-11 border-slate-300 focus-visible:ring-gray-300"
                      />
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
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password..."
                          {...field}
                          className="h-10 sm:h-11 pr-10 border-slate-300 focus-visible:ring-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name="remember"
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-slate-300"
                      />
                    )}
                  />
                  <span className="text-slate-600">Remember me</span>
                </div>

                <Button
                  type="button"
                  variant="link"
                  className="cursor-pointer p-0 h-auto text-amber-600 hover:text-amber-700"
                  onClick={() => router.push("/reset-password?mode=reset")}
                >
                  Forgot password?
                </Button>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 sm:h-11 text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-slate-400 text-xs font-medium">OR</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Google Login */}
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer w-full h-10 sm:h-11 flex items-center justify-center gap-2 border-slate-300 hover:bg-slate-50 transition-colors"
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
                <span className="text-sm sm:text-base">Continue with Google</span>
              </Button>

              {/* Register Link */}
              <p className="text-center text-xs sm:text-sm text-slate-600 pt-2">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signUpPage"
                  className="text-amber-600 hover:text-amber-700 font-semibold hover:underline"
                >
                  Sign Up
                </Link>
                {" "}here
              </p>

              {/* Back to Home */}
              <div className="flex items-center justify-center pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push("/")}
                  className="cursor-pointer text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}