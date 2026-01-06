interface ReferralCardProps {
  referralCode: string;
}

export default function ReferralCard({ referralCode }: ReferralCardProps) {
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