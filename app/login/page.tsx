"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FilmSlateIcon, SpinnerIcon, EnvelopeIcon, LockIcon } from "@phosphor-icons/react";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Mode = "signin" | "signup";

export default function LoginPage() {
    const router = useRouter();

    const [mode, setMode] = useState<Mode>("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        if (mode === "signin") {
            const { error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                setError(
                    error.message === "Invalid login credentials"
                        ? "Email o contraseña incorrectos."
                        : error.message
                );
                setLoading(false);
                return;
            }

            router.push("/");
            router.refresh();
        } else {
            const { error } = await supabase.auth.signUp({ email, password });

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }

            setSuccess("Cuenta creada. Revisa tu email para confirmar el registro.");
            setLoading(false);
        }
    }

    function switchMode(next: Mode) {
        setMode(next);
        setError(null);
        setSuccess(null);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="mb-8 flex flex-col items-center gap-3 text-center">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary shadow-md">
                        <FilmSlateIcon className="size-6 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="font-heading text-xl font-semibold text-foreground">
                            Aprobación de Contenido
                        </h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">Panel de Agencia</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {mode === "signin" ? "Iniciar sesión" : "Crear cuenta"}
                        </CardTitle>
                        <CardDescription>
                            {mode === "signin"
                                ? "Accede a tu panel para gestionar el contenido."
                                : "Regístrate para empezar a gestionar el contenido."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="email" className="text-sm font-medium text-foreground">
                                    Email
                                </label>
                                <div className="relative">
                                    <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                        required
                                        className="pl-9"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="password" className="text-sm font-medium text-foreground">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <LockIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                        required
                                        minLength={6}
                                        className="pl-9"
                                        autoComplete={mode === "signin" ? "current-password" : "new-password"}
                                    />
                                </div>
                            </div>

                            {/* Error message */}
                            {error && (
                                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    {error}
                                </p>
                            )}

                            {/* Success message */}
                            {success && (
                                <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-300">
                                    {success}
                                </p>
                            )}

                            <Button type="submit" disabled={loading} className="w-full">
                                {loading && (
                                    <SpinnerIcon data-icon="inline-start" className="animate-spin" />
                                )}
                                {loading
                                    ? mode === "signin"
                                        ? "Entrando…"
                                        : "Creando cuenta…"
                                    : mode === "signin"
                                        ? "Iniciar sesión"
                                        : "Crear cuenta"}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                        <Separator />
                        <p className="text-center text-sm text-muted-foreground">
                            {mode === "signin" ? (
                                <>
                                    ¿No tienes cuenta?{" "}
                                    <button
                                        type="button"
                                        onClick={() => switchMode("signup")}
                                        className="font-medium text-primary underline-offset-4 hover:underline"
                                    >
                                        Regístrate
                                    </button>
                                </>
                            ) : (
                                <>
                                    ¿Ya tienes cuenta?{" "}
                                    <button
                                        type="button"
                                        onClick={() => switchMode("signin")}
                                        className="font-medium text-primary underline-offset-4 hover:underline"
                                    >
                                        Iniciar sesión
                                    </button>
                                </>
                            )}
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
