import Sidebar from "@/components/admin/Sidebar";

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}