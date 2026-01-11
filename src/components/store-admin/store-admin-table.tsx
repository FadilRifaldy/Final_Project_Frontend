import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserCog, Store, Mail, Loader2, XCircle } from "lucide-react";
import { IStoreAdmin } from "@/lib/helpers/assign-store-admin.backend";

interface StoreAdminTableProps {
  admins: IStoreAdmin[];
  loading: boolean;
  assignLoading: string | null;
  searchQuery: string;
  onAssignClick: (admin: IStoreAdmin) => void;
  onUnassignClick: (admin: IStoreAdmin) => void;
}

export function StoreAdminTable({
  admins,
  loading,
  assignLoading,
  searchQuery,
  onAssignClick,
  onUnassignClick,
}: StoreAdminTableProps) {
  return (
    <div className="hidden lg:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
            <TableHead className="font-semibold text-slate-700">
              Store Admin
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Email
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Assigned Store
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Status
            </TableHead>
            <TableHead className="text-right font-semibold text-slate-700">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-64">
                <div className="flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-slate-500">
                    Loading store admins...
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : admins.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-64">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="p-4 bg-slate-50 rounded-full">
                    <UserCog className="h-8 w-8 text-slate-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-700">
                      No store admins found
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {searchQuery
                        ? "Try adjusting your search"
                        : "No store admins available"}
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            admins.map((admin) => (
              <TableRow
                key={admin.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                {/* Admin Name */}
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/5 rounded-lg">
                      <UserCog className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {admin.name}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Email */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm text-slate-700">
                      {admin.email}
                    </span>
                  </div>
                </TableCell>

                {/* Assigned Store */}
                <TableCell>
                  {admin.store ? (
                    <div className="flex items-start gap-2">
                      <Store className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-700">
                          {admin.store.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {admin.store.city}, {admin.store.province}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">
                      Not assigned
                    </span>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant={admin.storeId ? "default" : "secondary"}
                    className={`${
                      admin.storeId
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                    }`}
                  >
                    {admin.storeId ? "Assigned" : "Unassigned"}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAssignClick(admin)}
                      disabled={assignLoading === admin.id}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      {assignLoading === admin.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Store className="h-4 w-4 mr-1.5" />
                          {admin.storeId ? "Reassign" : "Assign"}
                        </>
                      )}
                    </Button>

                    {admin.storeId && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUnassignClick(admin)}
                        disabled={assignLoading === admin.id}
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-1.5" />
                        Unassign
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}