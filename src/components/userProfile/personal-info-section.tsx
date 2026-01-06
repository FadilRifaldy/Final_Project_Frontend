import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Smartphone, MailWarning } from "lucide-react";
import { IUser } from "@/types/user";

interface PersonalInfoSectionProps {
  user: IUser;
  phone: string;
  emailChanged: boolean;
  originalEmail: string;
  onUserChange: (user: IUser) => void;
  onPhoneChange: (phone: string) => void;
  onEmailChange: (changed: boolean) => void;
}

export default function PersonalInfoSection({
  user,
  phone,
  emailChanged,
  originalEmail,
  onUserChange,
  onPhoneChange,
  onEmailChange,
}: PersonalInfoSectionProps) {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        <User className="w-4 h-4" />
        Personal Information
      </h3>

      {/* Name and Email Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label className="text-xs sm:text-sm font-medium text-slate-700">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="Enter your full name"
            value={user.name}
            onChange={(e) => onUserChange({ ...user, name: e.target.value })}
            className="border-slate-300 focus-visible:ring-primary/20 text-sm h-10"
          />
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <Label className="text-xs sm:text-sm font-medium text-slate-700">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input
            disabled={user.provider === "GOOGLE"}
            value={user.email}
            onChange={(e) => {
              const newEmail = e.target.value;
              onUserChange({ ...user, email: newEmail });
              onEmailChange(newEmail !== originalEmail);
            }}
            className="border-slate-300 focus-visible:ring-primary/20 text-sm h-10"
          />
          {user.provider === "GOOGLE" && (
            <p className="text-xs text-slate-500">
              Email cannot be changed for Google accounts
            </p>
          )}
        </div>
      </div>

      {/* Email Change Warning */}
      {emailChanged && (
        <div className="flex items-start gap-2 sm:gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 sm:p-4">
          <MailWarning className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-medium text-amber-900">
              Email Change Detected
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Changing your email will require re-verification and a new login.
            </p>
          </div>
        </div>
      )}

      {/* Phone Number */}
      <div className="space-y-2">
        <Label className="text-xs sm:text-sm font-medium text-slate-700">
          Phone Number
        </Label>
        <div className="relative">
          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
          <Input
            placeholder="e.g. +62 812-3456-7890"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="pl-9 sm:pl-10 border-slate-300 focus-visible:ring-primary/20 text-sm h-10"
          />
        </div>
      </div>
    </div>
  );
}