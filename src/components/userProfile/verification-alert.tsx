import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2 } from "lucide-react";

interface VerificationAlertProps {
  sendingVerify: boolean;
  onSendVerify: () => void;
}

export default function VerificationAlert({
  sendingVerify,
  onSendVerify,
}: VerificationAlertProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-lg border border-amber-200 bg-amber-50">
      {/* Alert Message */}
      <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium text-amber-900">
            Email Not Verified
          </p>
          <p className="text-xs text-amber-700 mt-0.5">
            Please verify your email to unlock all features
          </p>
        </div>
      </div>

      {/* Verify Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={sendingVerify}
        onClick={onSendVerify}
        className="border-amber-300 hover:bg-amber-100 flex-shrink-0 w-full sm:w-auto text-xs sm:text-sm h-9"
      >
        {sendingVerify ? (
          <>
            <Loader2 className="mr-1.5 sm:mr-2 h-3 w-3 animate-spin" />
            Sending...
          </>
        ) : (
          "Verify Email"
        )}
      </Button>
    </div>
  );
}