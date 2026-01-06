import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Upload,
} from "lucide-react";
import { IUser } from "@/types/user";

interface AvatarSectionProps {
  user: IUser;
  avatarPreview: string | null;
  avatarFile: File | null;
  uploading: boolean;
  uploadProgress: number;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadAvatar: () => void;
}

export default function AvatarSection({
  user,
  avatarPreview,
  avatarFile,
  uploading,
  uploadProgress,
  onAvatarChange,
  onUploadAvatar,
}: AvatarSectionProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200">
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <div className="relative">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-white shadow-lg">
            <AvatarImage
              src={
                avatarPreview ||
                user.profileImage ||
                "/avatar-placeholder.png"
              }
            />
            <AvatarFallback className="text-xl sm:text-2xl bg-primary/10 text-primary">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <label className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90 shadow-lg transition-colors">
            <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
            <input
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={onAvatarChange}
              disabled={uploading}
            />
          </label>
        </div>
        
        <p className="text-xs text-slate-500 text-center">
          JPG, PNG, GIF · Max 1MB
        </p>
      </div>

      {/* User Info */}
      <div className="flex-1 space-y-2 sm:space-y-3 text-center sm:text-left w-full">
        <div>
          <h3 className="font-semibold text-base sm:text-lg text-slate-900 truncate">
            {user.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 truncate">{user.email}</p>
        </div>

        {/* Verification Badge */}
        <div className="flex justify-center sm:justify-start">
          <Badge
            variant={user.isVerified ? "default" : "secondary"}
            className={`text-xs ${
              user.isVerified
                ? "bg-green-100 text-green-700 hover:bg-green-100"
                : "bg-amber-100 text-amber-700 hover:bg-amber-100"
            }`}
          >
            {user.isVerified ? (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verified
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Unverified
              </>
            )}
          </Badge>
        </div>

        {/* Upload Button */}
        {avatarFile && (
          <Button
            size="sm"
            onClick={onUploadAvatar}
            disabled={uploading}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                {uploadProgress}%
              </>
            ) : (
              <>
                <Upload className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Upload Photo
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}