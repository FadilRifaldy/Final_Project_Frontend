import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
    progress: number;
    message?: string;
}

/* Reusable loading screen component dengan progress bar amber-500. 
Digunakan untuk konsistensi loading UI di seluruh halaman admin */
export function LoadingScreen({ progress, message = "Loading..." }: LoadingScreenProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
            <div className="w-full max-w-md space-y-3">
                <Progress value={progress} className="h-2 [&>div]:bg-amber-500" />
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
                    <span>{message}</span>
                </div>
            </div>
        </div>
    );
}
