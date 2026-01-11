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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Store, Loader2, CheckCircle2 } from "lucide-react";
import { IStoreAdmin, IAvailableStore } from "@/lib/helpers/assign-store-admin.backend";

interface AssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAdmin: IStoreAdmin | null;
  selectedStoreId: string;
  availableStores: IAvailableStore[];
  assignLoading: string | null;
  onStoreChange: (storeId: string) => void;
  onConfirm: () => void;
}

export function AssignDialog({
  open,
  onOpenChange,
  selectedAdmin,
  selectedStoreId,
  availableStores,
  assignLoading,
  onStoreChange,
  onConfirm,
}: AssignDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <AlertDialogTitle className="text-lg">
              Assign Store
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-slate-600">
            Pilih store untuk{" "}
            <span className="font-medium text-slate-900">
              {selectedAdmin?.name}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <label className="text-sm font-medium mb-2 block">
            Select Store
          </label>
          <Select value={selectedStoreId} onValueChange={onStoreChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a store..." />
            </SelectTrigger>
            <SelectContent>
              {availableStores.map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{store.name}</span>
                    <span className="text-xs text-slate-500">
                      {store.city}, {store.province}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel
            disabled={!!assignLoading}
            className="m-0 w-full sm:w-auto"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={!selectedStoreId || !!assignLoading}
            className="m-0 w-full sm:w-auto"
          >
            {assignLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Assign Store
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}