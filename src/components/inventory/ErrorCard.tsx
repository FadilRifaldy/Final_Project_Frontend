import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorCardProps {
    title: string;
    description: string;
    buttonText: string;
    buttonPath: string;
    variant?: 'warning' | 'error';
}

export function ErrorCard({
    title,
    description,
    buttonText,
    buttonPath,
    variant = 'error'
}: ErrorCardProps) {
    const router = useRouter();

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlertCircle className={`h-5 w-5 ${variant === 'warning' ? 'text-amber-500' : 'text-destructive'}`} />
                        <CardTitle>{title}</CardTitle>
                    </div>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.push(buttonPath)} className="w-full">
                        {buttonText}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
