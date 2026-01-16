"use client";

import { getAllUsers } from "@/lib/helpers/usersManagement.backend";
import { useEffect, useState } from "react";
import { IUser } from "@/types/user";
import UsersTable from "@/components/admin/UsersTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UsersManagementPage() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getAllUsers();
            if (res.success && res.data) {
                setUsers(res.data);
            } else {
                setError(res.message || "Failed to fetch users");
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
            setError("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Users Management
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Kelola semua pengguna di sistem
                            </p>
                        </div>
                    </div>
                    <Button onClick={fetchUsers} variant="outline" disabled={loading}>
                        {loading ? "Refreshing..." : "Refresh"}
                    </Button>
                </div>

                {/* Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Pengguna</CardTitle>
                        <CardDescription>
                            Total {users.length} pengguna terdaftar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Loading State */}
                        {loading && (
                            <div className="space-y-3">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-[400px] w-full" />
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    {error}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={fetchUsers}
                                        className="ml-4"
                                    >
                                        Coba Lagi
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Users Table */}
                        {!loading && !error && (
                            <UsersTable users={users} onUserDeleted={fetchUsers} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}