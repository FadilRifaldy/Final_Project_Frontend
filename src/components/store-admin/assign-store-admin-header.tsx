import { Card, CardContent } from "@/components/ui/card";
import { UserCog, CheckCircle2, XCircle } from "lucide-react";

interface AssignStoreAdminHeaderProps {
  totalAdmins: number;
  assignedCount: number;
  unassignedCount: number;
}

export function AssignStoreAdminHeader({
  totalAdmins,
  assignedCount,
  unassignedCount,
}: AssignStoreAdminHeaderProps) {
  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserCog className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Assign Store Admin
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Kelola penempatan store admin ke toko
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Store Admins
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {totalAdmins}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <UserCog className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Assigned</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {assignedCount}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Unassigned
                </p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {unassignedCount}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-full">
                <XCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}