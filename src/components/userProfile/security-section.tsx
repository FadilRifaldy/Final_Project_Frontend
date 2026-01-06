import { Button } from "@/components/ui/button";
import { Lock, ShieldCheck } from "lucide-react";

interface SecuritySectionProps {
  provider: string;
  onChangePassword: () => void;
}

export default function SecuritySection({
  provider,
  onChangePassword,
}: SecuritySectionProps) {
  return (
    <div className="space-y-3">
      {/* Section Header */}
      <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        <Lock className="w-4 h-4" />
        Account Security
      </h3>

      {/* Password Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-lg border border-slate-200 bg-slate-50">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium text-slate-900">Password</p>
          <p className="text-xs text-slate-500 mt-1">
            {provider === "GOOGLE"
              ? "Managed by Google"
              : "Change your password via email verification"}
          </p>
        </div>

        <Button
          disabled={provider === "GOOGLE"}
          variant="outline"
          size="sm"
          onClick={onChangePassword}
          className="flex-shrink-0 w-full sm:w-auto text-xs sm:text-sm h-9"
        >
          Change Password
        </Button>
      </div>

      {/* Google Account Info */}
      {provider === "GOOGLE" && (
        <div className="flex items-start gap-2 p-2.5 sm:p-3 rounded-lg bg-blue-50 border border-blue-200">
          <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700">
            Your account is secured by Google. Password changes must be done
            through your Google account.
          </p>
        </div>
      )}
    </div>
  );
}