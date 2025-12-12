"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signupSchema, SignUpValues } from "@/lib/validations/auth";
import { signUpUser } from "@/lib/helpers/auth.backend";

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

export default function SignUpPage() {
  const [hasReferral, setHasReferral] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      referralCode: "",
    },
  });

  async function onSubmit(values: SignUpValues) {
    setLoading(true);

    try {
      const res = await signUpUser(values);

      if (res.message === "Register Success") {
        toast.success("Register Success!");
        router.push("/signInPage");
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.log("REGISTER FAILED:", err);
      toast.error("Server Error");
    } finally {
      setLoading(false);
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
            Sign Up
          </h1>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* First Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
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

            {/* Email */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter password..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Referral Option */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={hasReferral}
                  onChange={(e) => setHasReferral(e.target.checked)}
                />
                have a referral code?
              </label>

              {hasReferral && (
                <FormField
                  control={form.control}
                  name="referralCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referral Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter referral code (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Submit Button */}
            <Button
              disabled={loading}
              type="submit"
              className="w-full text-white bg-amber-500 hover:bg-amber-600"
            >
              {loading ? "Loading..." : "Sign Up"}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-muted-foreground/20" />
              <span className="text-muted-foreground text-xs">OR</span>
              <div className="h-px flex-1 bg-muted-foreground/20" />
            </div>

            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Image
                src="/google-icon.png"
                alt="Google"
                width={20}
                height={20}
              />
              Login dengan Google
            </Button>

            {/* Link to login */}
            <p className="text-center text-sm text-muted-foreground mt-2">
              Already have an account?{" "}
              <Link
                href="/signInPage"
              >
                <span className="font-medium text-amber-500 hover:text-amber-600 hover:underline">Sign In</span> here
              </Link>
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
