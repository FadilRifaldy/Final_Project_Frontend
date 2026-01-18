interface ReferralCardProps {
  referralCode?: string; // Optional untuk handle undefined
}

export default function ReferralCard({ referralCode }: ReferralCardProps) {
  // Jika referralCode undefined, tampilkan placeholder
  if (!referralCode) {
    return (
      <div className="p-3 sm:p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <span className="text-xs sm:text-sm font-medium text-slate-900">
              Referral Code
            </span>
            <p className="text-xs text-slate-600 mt-1">
              Your referral code will appear here
            </p>
          </div>
          <div className="px-3 sm:px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm flex-shrink-0">
            <code className="font-mono font-semibold text-slate-400 text-base sm:text-lg">
              N/A
            </code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Info */}
        <div className="min-w-0">
          <span className="text-xs sm:text-sm font-medium text-slate-900">
            Referral Code
          </span>
          <p className="text-xs text-slate-600 mt-1">
            Share this code with friends to earn rewards
          </p>
        </div>

        {/* Code Display */}
        <div className="px-3 sm:px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm flex-shrink-0">
          <code className="font-mono font-semibold text-primary text-base sm:text-lg">
            {referralCode}
          </code>
        </div>
      </div>
    </div>
  );
}