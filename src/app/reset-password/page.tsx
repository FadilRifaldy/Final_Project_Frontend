import { Suspense } from 'react';
import ResetPasswordContent from './reset-password-content';
import { Loader2 } from 'lucide-react';

// Loading fallback
function ResetPasswordLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-amber-500 animate-spin mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Memuat...</h3>
        <p className="text-gray-600">Mohon tunggu sebentar</p>
      </div>
    </div>
  );
}

// Wrapper dengan Suspense boundary
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
