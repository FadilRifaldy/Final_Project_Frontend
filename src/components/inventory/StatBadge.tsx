import { cn } from '@/lib/utils';

interface StatBadgeProps {
    color: 'green' | 'amber' | 'red';
    label: string;
    value: number;
}

export function StatBadge({ color, label, value }: StatBadgeProps) {
    const colorClasses = {
        green: 'bg-green-500',
        amber: 'bg-amber-500',
        red: 'bg-red-500'
    };

    return (
        <div className="flex items-center gap-1">
            <div className={cn("h-2 w-2 rounded-full", colorClasses[color])} />
            <span className="text-muted-foreground">{label}:</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}
