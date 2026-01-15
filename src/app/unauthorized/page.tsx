// Unauthorized Page
import Link from "next/link";

export default function Unauthorized() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Unauthorized</h1>
            <p className="text-lg">You do not have permission to access this page.</p>
            <Link href="/" className="mt-4 text-blue-500 hover:underline">Back to Home</Link>
        </div>
    );
}