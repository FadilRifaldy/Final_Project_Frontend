"use client";

import { UseFormReturn } from "react-hook-form";
import { SignUpValues } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Store, ShoppingBag, ArrowRight } from "lucide-react";
import { SignUpFormContent } from "./signup-form-content";

type SignUpRole = "CUSTOMER" | "STORE_ADMIN";

interface SignUpCardProps {
  role: SignUpRole;
  hasReferral: boolean;
  setHasReferral: (value: boolean) => void;
  loading: boolean;
  form: UseFormReturn<SignUpValues>;
  onSubmit: (values: SignUpValues) => Promise<void>;
  onSwitchRole: (role: SignUpRole) => void;
}

export function SignUpCard({
  role,
  hasReferral,
  setHasReferral,
  loading,
  form,
  onSubmit,
  onSwitchRole,
}: SignUpCardProps) {
  return (
    <div className="w-full max-w-5xl">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex flex-col md:flex-row relative h-[700px] md:h-[730px]">
          {/* LEFT SIDE - Customer Form */}
          <div
            className={`w-full md:w-1/2 p-6 sm:p-8 md:p-10 transition-all duration-500 flex flex-col ${
              role === "STORE_ADMIN"
                ? "hidden md:flex md:opacity-0 md:pointer-events-none"
                : "flex md:opacity-100"
            }`}
          >
            <SignUpFormContent
              title="Sign Up as Customer"
              subtitle="Shop products and enjoy our marketplace"
              role="CUSTOMER"
              hasReferral={hasReferral}
              setHasReferral={setHasReferral}
              loading={loading}
              form={form}
              onSubmit={onSubmit}
            />
          </div>

          {/* RIGHT SIDE - Store Admin Form */}
          <div
            className={`w-full md:w-1/2 p-6 sm:p-8 md:p-10 transition-all duration-500 md:absolute md:right-0 md:top-0 md:h-full flex flex-col ${
              role === "CUSTOMER"
                ? "hidden md:flex md:opacity-0 md:pointer-events-none"
                : "flex md:opacity-100"
            }`}
          >
            <SignUpFormContent
              title="Sign Up as Store Admin"
              subtitle="Manage your store with powerful tools"
              role="STORE_ADMIN"
              hasReferral={false}
              setHasReferral={() => {}}
              loading={loading}
              form={form}
              onSubmit={onSubmit}
            />
          </div>

          {/* SLIDING OVERLAY PANEL */}
          <div
            className={`absolute top-0 h-full w-full md:w-1/2 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white transition-transform duration-700 ease-in-out ${
              role === "CUSTOMER" ? "md:translate-x-full" : "md:translate-x-0"
            } hidden md:flex items-center justify-center z-10`}
          >
            <div className="text-center px-8 max-w-md">
              {role === "CUSTOMER" ? (
                <>
                  <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm shadow-xl">
                    <Store className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                    Manage Your Store
                  </h2>
                  <p className="text-amber-50 text-base mb-8 leading-relaxed">
                    Access powerful dashboard, track inventory, manage orders,
                    and grow your business.
                  </p>
                  <Button
                    size="lg"
                    variant="outline"
                    className="cursor-pointer border-2 border-white text-amber-600 hover:bg-white hover:text-amber-600 font-semibold px-8 transition-all hover:scale-105 duration-500"
                    onClick={() => onSwitchRole("STORE_ADMIN")}
                  >
                    Switch to Store Admin
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm shadow-xl">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                    Start Shopping
                  </h2>
                  <p className="text-amber-50 text-base mb-8 leading-relaxed">
                    Discover amazing products, enjoy seamless checkout, and
                    track your orders easily.
                  </p>
                  <Button
                    size="lg"
                    variant="outline"
                    className="cursor-pointer border-2 border-white text-amber-600 hover:bg-white hover:text-amber-600 font-semibold px-8 transition-all hover:scale-105 duration-500"
                    onClick={() => onSwitchRole("CUSTOMER")}
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Switch to Customer
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* MOBILE - Role Tabs */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-20">
            <div className="grid grid-cols-2 max-w-md mx-auto">
              <button
                onClick={() => onSwitchRole("CUSTOMER")}
                className={`py-4 px-6 text-sm font-semibold transition-all ${
                  role === "CUSTOMER"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <ShoppingBag className="w-5 h-5 mx-auto mb-1" />
                Customer
              </button>
              <button
                onClick={() => onSwitchRole("STORE_ADMIN")}
                className={`py-4 px-6 text-sm font-semibold transition-all ${
                  role === "STORE_ADMIN"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Store className="w-5 h-5 mx-auto mb-1" />
                Store Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}