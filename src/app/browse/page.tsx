import { Suspense } from 'react';
import BrowsePageContent from './browse-content';
import { Loader2 } from 'lucide-react';

// Loading fallback untuk Suspense
function BrowsePageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-amber-500 animate-spin mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Memuat...</h3>
        <p className="text-gray-600">Mohon tunggu sebentar</p>
      </div>
    </div>
  );
}

// Wrapper dengan Suspense boundary untuk handle useSearchParams()
export default function BrowsePage() {
  return (
    <Suspense fallback={<BrowsePageLoading />}>
      <BrowsePageContent />
    </Suspense>
  );
}