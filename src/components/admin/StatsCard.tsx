import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface IStatsCard {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export default function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
}: IStatsCard) {
    return (
        <Card className="p-3 md:p-4 hover:shadow-xl transition-shadow bg-gray-200">
            <CardHeader className="p-0 pb-2 md:pb-3">
                <CardTitle className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <span className="text-sm md:text-base">{title}</span>
                    {trend && (
                        <span
                            className={`text-xs md:text-sm font-medium ${trend.isPositive ? "text-green-500" : "text-red-500"
                                }`}
                        >
                            {trend.isPositive ? "+" : "-"}{trend.value}%
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="flex items-center gap-2 md:gap-3">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0" />
                    <span className="text-xl md:text-2xl font-bold truncate">{value}</span>
                </div>
            </CardContent>
        </Card>
    )
}