// placeholder, feature not implemented yet
import Link from "next/link";

export default function OrdersPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>Orders Page (Not implemented yet)</h1>
            {/* back to dashboard Link */}
            <div className="mt-4">
                <Link href="/admin/dashboard" className="text-blue-500">Back to Dashboard</Link>
            </div>
        </div>
    );
}
