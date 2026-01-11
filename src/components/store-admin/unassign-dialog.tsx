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
import { Loader2, XCircle } from "lucide-react";
import { IStoreAdmin } from "@/lib/helpers/assign-store-admin.backend";

interface UnassignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAdmin: IStoreAdmin | null;
  assignLoading: string | null;
  onConfirm: () => void;
}

export function UnassignDialog({
  open,
  onOpenChange,
  selectedAdmin,
  assignLoading,
  onConfirm,
}: UnassignDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 rounded-full">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <AlertDialogTitle className="text-lg">
              Unassign Store?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-slate-600">
            Apakah Anda yakin ingin unassign{" "}
            <span className="font-medium text-slate-900">
              {selectedAdmin?.name}
            </span>{" "}
            dari{" "}
            <span className="font-medium text-slate-900">
              {selectedAdmin?.store?.name}
            </span>
            ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel
            disabled={!!assignLoading}
            className="m-0 w-full sm:w-auto"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={!!assignLoading}
            className="bg-red-600 hover:bg-red-700 m-0 w-full sm:w-auto"
          >
            {assignLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Unassigning...
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Unassign Store
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}