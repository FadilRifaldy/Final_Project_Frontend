import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full border border-neutral-200">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-50 rounded-full">
            <ShieldAlert className="w-12 h-12 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Access Denied</h1>
        <p className="text-neutral-600 mb-8">
          You do not have the required permissions to access this page. Please contact your administrator if you believe this is an error.
        </p>

        <div className="space-y-3">
            <Link href="/" className="w-full block">
              <Button variant="default" className="w-full">
                Back to Home
              </Button>
            </Link>
            
            <Link href="/signInPage" className="w-full block">
              <Button variant="outline" className="w-full">
                Login with Different Account
              </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}