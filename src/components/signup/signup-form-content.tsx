"use client";

import { UseFormReturn } from "react-hook-form";
import { SignUpValues } from "@/lib/validations/auth";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SignUpRole = "CUSTOMER" | "STORE_ADMIN";

interface SignUpFormContentProps {
  title: string;
  subtitle: string;
  role: SignUpRole;
  hasReferral: boolean;
  setHasReferral: (value: boolean) => void;
  loading: boolean;
  form: UseFormReturn<SignUpValues>;
  onSubmit: (values: SignUpValues) => Promise<void>;
}

export function SignUpFormContent({
  title,
  subtitle,
  role,
  hasReferral,
  setHasReferral,
  loading,
  form,
  onSubmit,
}: SignUpFormContentProps) {
  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-12rem)] md:max-h-[730px]">
      {/* Logo & Title - Fixed at top */}
      <div className="flex flex-col items-center mb-6 flex-shrink-0">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
          <Image
            src="/logo.png"
            alt="Logo"
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mt-2 text-slate-900 text-center">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 text-center">
          {subtitle}
        </p>
      </div>

      {/* Form - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0 px-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pb-20 md:pb-4"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name..."
                      {...field}
                      className="h-11 border-slate-300 focus-visible:ring-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      className="h-11 border-slate-300 focus-visible:ring-gray-300"
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
                    <Input
                      type="password"
                      placeholder="Create a password..."
                      {...field}
                      className="h-11 border-slate-300 focus-visible:ring-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Referral Code (Customer Only) */}
            {role === "CUSTOMER" && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasReferral}
                    onChange={(e) => setHasReferral(e.target.checked)}
                    className="w-4 h-4 text-amber-500 border-slate-300 rounded focus:ring-gray-300"
                  />
                  I have a referral code
                </label>

                {hasReferral && (
                  <FormField
                    control={form.control}
                    name="referralCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Enter referral code..."
                            {...field}
                            className="h-10 border-slate-300 focus-visible:ring-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {/* Submit */}
            <Button
              disabled={loading}
              type="submit"
              className="cursor-pointer w-full h-11 text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>

            {/* Google Login */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-slate-400 text-xs font-medium">OR</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="cursor-pointer w-full h-11 flex items-center justify-center gap-2 border-slate-300 hover:bg-slate-50"
              onClick={async () => {
                localStorage.setItem("signup_role", role);

                const { error } = await supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                  },
                });

                if (error) toast.error("Google login gagal");
              }}
            >
              <Image
                src="/images/Google.svg"
                alt="Google"
                width={20}
                height={20}
              />
              <span className="text-sm">
                Continue with Google as{" "}
                {role === "STORE_ADMIN" ? "Store Admin" : "Customer"}
              </span>
            </Button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-slate-600 pt-2">
              Already have an account?{" "}
              <Link
                href="/signInPage"
                className="text-amber-600 hover:text-amber-700 font-semibold hover:underline"
              >
                Sign In
              </Link>{" "}
              or{" "}
              <Link
                href="/"
                className="hover:underline text-slate-500 font-semibold"
              >
                Back to Home
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}