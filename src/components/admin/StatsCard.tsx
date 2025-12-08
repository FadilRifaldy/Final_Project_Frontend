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
        <Card className="p-4 hover:shadow-xl transition-shadow bg-gray-200">
            <CardHeader>
                <CardTitle className="flex justify-between">
                    {title}
                    {trend && (
                        <span
                            className={`text-sm ${trend.isPositive ? "text-green-500" : "text-red-500"
                                }`}
                        >
                            {trend.isPositive ? "+" : "-"}{trend.value}%
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <Icon className="w-6 h-6 text-primary" />
                    <span className="text-2xl font-bold">{value}</span>
                </div>
            </CardContent>
        </Card>
    )
}