"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { confirmEmailVerification } from "@/lib/helpers/auth.backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    if (!token) {
        return <p className="text-center mt-20">Token tidak valid</p>;
    }

    const handleVerify = async () => {
        if (!password) {
            toast.error("Password wajib diisi");
            return;
        }

        setLoading(true);

        const res = await confirmEmailVerification(token, password);

        setLoading(false);

        if (!res.success) {
            toast.error(res.message);
            return;
        }

        toast.success(res.message);
        router.replace("/signInPage");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <Card className="w-full max-w-md rounded-2xl shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">
                        Verifikasi Email
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">
                        Masukkan password akun kamu untuk menyelesaikan verifikasi email.
                    </p>

                    <Input
                        type="password"
                        placeholder="Password akun"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        className="w-full bg-amber-500 hover:bg-amber-600"
                        onClick={handleVerify}
                        disabled={loading}
                    >
                        {loading ? "Memverifikasi..." : "Verifikasi Akun"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
