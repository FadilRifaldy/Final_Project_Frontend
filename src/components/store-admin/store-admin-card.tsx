import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserCog, Store, Loader2, XCircle } from "lucide-react";
import { IStoreAdmin } from "@/lib/helpers/assign-store-admin.backend";

interface StoreAdminCardsProps {
  admins: IStoreAdmin[];
  loading: boolean;
  assignLoading: string | null;
  searchQuery: string;
  onAssignClick: (admin: IStoreAdmin) => void;
  onUnassignClick: (admin: IStoreAdmin) => void;
}

export function StoreAdminCards({
  admins,
  loading,
  assignLoading,
  searchQuery,
  onAssignClick,
  onUnassignClick,
}: StoreAdminCardsProps) {
  return (
    <div className="lg:hidden p-4 space-y-3">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-slate-500">Loading store admins...</p>
        </div>
      ) : admins.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
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
      ) : (
        admins.map((admin) => (
          <Card key={admin.id} className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-primary/5 rounded-lg flex-shrink-0">
                    <UserCog className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 truncate">
                      {admin.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {admin.email}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={admin.storeId ? "default" : "secondary"}
                  className={`flex-shrink-0 text-xs ${
                    admin.storeId
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                  }`}
                >
                  {admin.storeId ? "Assigned" : "Unassigned"}
                </Badge>
              </div>

              <div className="space-y-2 mb-3 text-sm">
                {admin.store ? (
                  <div className="flex items-start gap-2 text-slate-600">
                    <Store className="h-3.5 w-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-slate-700">
                        {admin.store.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {admin.store.city}, {admin.store.province}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Store className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="text-xs">Not assigned to any store</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAssignClick(admin)}
                  disabled={assignLoading === admin.id}
                  className="flex-1"
                >
                  {assignLoading === admin.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <Store className="h-3.5 w-3.5 mr-1.5" />
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
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1.5" />
                    Unassign
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}