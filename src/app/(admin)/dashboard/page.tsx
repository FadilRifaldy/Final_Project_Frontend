export default function DashboardPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Dashboard Admin</h1>
            <p className="text-gray-600">Selamat datang di halaman dashboard!</p>

            <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Total Produk</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">150</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Total Stok</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">1,250</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Diskon Aktif</h3>
                    <p className="text-3xl font-bold text-orange-600 mt-2">12</p>
                </div>
            </div>
        </div>
    )
}
