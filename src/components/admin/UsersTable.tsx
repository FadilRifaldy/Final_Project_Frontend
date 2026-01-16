"use client";

import { IUser } from "@/types/user";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Search, Filter } from "lucide-react";
import { deleteUser } from "@/lib/helpers/usersManagement.backend";
import { toast } from "sonner";

interface UsersTableProps {
    users: IUser[];
    onUserDeleted: () => void; // Callback untuk refresh data setelah delete
}

export default function UsersTable({ users, onUserDeleted }: UsersTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("ALL");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter users berdasarkan search dan role
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    // Handle delete user
    const handleDeleteClick = (user: IUser) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedUser) return;

        setIsDeleting(true);
        try {
            await deleteUser(selectedUser.id);
            toast.success(`User ${selectedUser.name} berhasil dihapus`);
            setDeleteDialogOpen(false);
            onUserDeleted(); // Refresh data
        } catch (error) {
            toast.error("Gagal menghapus user");
            console.error("Delete error:", error);
        } finally {
            setIsDeleting(false);
            setSelectedUser(null);
        }
    };

    // Helper function untuk badge role
    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case "SUPER_ADMIN":
                return "destructive";
            case "STORE_ADMIN":
                return "default";
            case "CUSTOMER":
                return "secondary";
            default:
                return "outline";
        }
    };

    // Helper function untuk format tanggal
    const formatDate = (date?: string | Date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-4">
            {/* Filter & Search Section */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama atau email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Role Filter */}
                <div className="flex items-center gap-2 sm:w-[200px]">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Semua Role</SelectItem>
                            <SelectItem value="CUSTOMER">Customer</SelectItem>
                            <SelectItem value="STORE_ADMIN">Store Admin</SelectItem>
                            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
                Menampilkan {filteredUsers.length} dari {users.length} users
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Provider</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Bergabung</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="text-center py-8 text-muted-foreground"
                                >
                                    Tidak ada user yang ditemukan
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.name}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={getRoleBadgeVariant(user.role)}>
                                            {user.role.replace("_", " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {user.provider}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {user.isVerified ? (
                                            <Badge variant="default" className="bg-green-500">
                                                Verified
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">
                                                Not Verified
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {formatDate(user.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteClick(user)}
                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus User?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah kamu yakin ingin menghapus user{" "}
                            <span className="font-semibold">{selectedUser?.name}</span>?
                            <br />
                            <span className="text-xs text-muted-foreground mt-2 block">
                                User akan di-soft delete dan bisa di-restore nanti.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {isDeleting ? "Menghapus..." : "Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
