"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Building2, UserPlus, Mail, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getStoreAdmins, IStoreAdmin } from "@/lib/helpers/assign-store-admin.backend";

export default function AdminListPage() {
    const [admins, setAdmins] = useState<IStoreAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const res = await getStoreAdmins();
            if (res.success && res.data) {
                setAdmins(res.data);
            } else {
                toast.error(res.message || "Failed to fetch admins");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading data");
        } finally {
            setLoading(false);
        }
    };

    const filteredAdmins = admins.filter(
        (admin) =>
            admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600/10 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Store Admins
                            </h1>
                            <p className="text-sm text-slate-500">
                                List of all registered store administrators
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="border-slate-200 shadow-sm">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Admins</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{admins.length}</p>
                            </div>
                            <div className="p-3 bg-slate-100 rounded-full">
                                <Users className="h-5 w-5 text-slate-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Assigned</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">
                                    {admins.filter(a => a.storeId).length}
                                </p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-full">
                                <Building2 className="h-5 w-5 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Unassigned</p>
                                <p className="text-2xl font-bold text-amber-600 mt-1">
                                    {admins.filter(a => !a.storeId).length}
                                </p>
                            </div>
                            <div className="p-3 bg-amber-50 rounded-full">
                                <UserPlus className="h-5 w-5 text-amber-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* List Content */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 bg-white/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <CardTitle>Admin Database</CardTitle>
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="Search name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50">
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Assigned Store</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-500">
                                                <Loader2 className="h-6 w-6 animate-spin mb-2" />
                                                Loading data...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredAdmins.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                                            No admins found matching your search.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAdmins.map((admin) => (
                                        <TableRow key={admin.id} className="hover:bg-slate-50/50">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                        {admin.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    {admin.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Mail className="h-3.5 w-3.5" />
                                                    {admin.email}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {admin.store ? (
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-4 w-4 text-blue-500" />
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-900">{admin.store.name}</p>
                                                            <p className="text-xs text-slate-500">{admin.store.city}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 italic text-sm">Not assigned</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={admin.storeId ? "default" : "secondary"} className={admin.storeId ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-slate-100 text-slate-600 hover:bg-slate-100"}>
                                                    {admin.storeId ? "Active" : "Pending Assignment"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
