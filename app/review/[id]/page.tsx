"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLocale, useTheme } from "@/components/providers";
import { translations } from "@/lib/i18n";
import { toast } from "sonner";
import {
    CheckCircleIcon,
    XCircleIcon,
    SpinnerIcon,
    FilmSlateIcon,
    ArrowLeftIcon,
    ClockIcon,
    WarningCircleIcon,
    SunIcon,
    MoonIcon,
    GlobeIcon,
} from "@phosphor-icons/react";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "pending" | "approved" | "rejected";

interface ContentPiece {
    id: string;
    title: string;
    video_url: string;
    status: Status;
    feedback: string | null;
    created_at: string;
}

// ─── Video helpers ────────────────────────────────────────────────────────────

function getYouTubeEmbedUrl(url: string): string | null {
    try {
        const u = new URL(url);
        if (u.hostname === "youtu.be") {
            return `https://www.youtube.com/embed${u.pathname}`;
        }
        if (u.hostname.includes("youtube.com")) {
            if (u.pathname.startsWith("/embed/")) return url;
            const v = u.searchParams.get("v");
            if (v) return `https://www.youtube.com/embed/${v}`;
        }
    } catch {
        // URL inválida — continúa
    }
    return null;
}

function getVimeoEmbedUrl(url: string): string | null {
    try {
        const u = new URL(url);
        if (u.hostname === "vimeo.com" || u.hostname === "www.vimeo.com") {
            const id = u.pathname.replace(/^\//, "");
            if (/^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
        }
    } catch {
        // URL inválida — continúa
    }
    return null;
}

type VideoKind =
    | { kind: "youtube" | "vimeo"; embedUrl: string }
    | { kind: "native" };

function detectVideo(url: string): VideoKind {
    const yt = getYouTubeEmbedUrl(url);
    if (yt) return { kind: "youtube", embedUrl: yt };
    const vimeo = getVimeoEmbedUrl(url);
    if (vimeo) return { kind: "vimeo", embedUrl: vimeo };
    return { kind: "native" };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_BADGE_CLASS: Record<Status, string> = {
    pending: "border bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
    approved: "border bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
    rejected: "border bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
};

function formatDate(iso: string, locale: string) {
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(iso));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function VideoPlayer({ url }: { url: string }) {
    const video = detectVideo(url);

    if (video.kind === "youtube" || video.kind === "vimeo") {
        return (
            <div
                className="relative w-full overflow-hidden rounded-2xl bg-black shadow-lg"
                style={{ paddingTop: "56.25%" }}
            >
                <iframe
                    src={video.embedUrl}
                    className="absolute inset-0 size-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Reproductor de video"
                />
            </div>
        );
    }

    return (
        <video
            src={url}
            controls
            className="w-full rounded-2xl bg-black shadow-lg"
        />
    );
}

function NotFound() {
    const { locale } = useLocale();
    const t = translations[locale];
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                        <WarningCircleIcon className="size-7 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="font-heading text-base font-semibold text-foreground">
                            {t.notFoundTitle}
                        </p>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            {t.notFoundDesc}
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/">
                            <ArrowLeftIcon data-icon="inline-start" />
                            {t.backToPanel}
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

function ActionBanner({ status }: { status: "approved" | "rejected" }) {
    const { locale } = useLocale();
    const t = translations[locale];
    const isApproved = status === "approved";
    return (
        <div
            className={cn(
                "flex items-start gap-3 rounded-xl border p-4",
                isApproved
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
            )}
        >
            {isApproved ? (
                <CheckCircleIcon className="mt-0.5 size-5 shrink-0" />
            ) : (
                <XCircleIcon className="mt-0.5 size-5 shrink-0" />
            )}
            <div>
                <p className="text-sm font-semibold">
                    {isApproved ? t.approvedBannerTitle : t.rejectedBannerTitle}
                </p>
                <p className="mt-0.5 text-xs opacity-80">
                    {isApproved ? t.approvedBannerDesc : t.rejectedBannerDesc}
                </p>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReviewPage() {
    const params = useParams();
    const id = params?.id as string;
    const { locale, setLocale } = useLocale();
    const { theme, setTheme } = useTheme();
    const t = translations[locale];
    const STATUS_LABEL: Record<Status, string> = {
        pending: t.statusPending,
        approved: t.statusApproved,
        rejected: t.statusRejected,
    };
    const [item, setItem] = useState<ContentPiece | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [approving, setApproving] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [rejecting, setRejecting] = useState(false);
    const [actionDone, setActionDone] = useState(false);

    useEffect(() => {
        if (!id) return;

        async function loadItem() {
            setLoading(true);
            const { data, error } = await supabase
                .from("content_pieces")
                .select("*")
                .eq("id", id)
                .single();

            setLoading(false);

            if (error || !data) {
                setNotFound(true);
                return;
            }

            const piece = data as ContentPiece;
            setItem(piece);
            if (piece.status !== "pending") setActionDone(true);
        }

        loadItem();
    }, [id]);

    async function handleApprove() {
        if (!item || approving || actionDone) return;
        setApproving(true);

        const { error } = await supabase
            .from("content_pieces")
            .update({ status: "approved", feedback: null })
            .eq("id", item.id);

        setApproving(false);

        if (error) {
            toast.error(t.toastApproveError);
            return;
        }

        setItem((prev) => (prev ? { ...prev, status: "approved" } : prev));
        setActionDone(true);
        toast.success(t.toastApproved);
    }

    async function handleReject() {
        if (!item || rejecting || actionDone) return;

        const trimmed = feedback.trim();
        if (!trimmed) {
            toast.error(t.toastFeedbackRequired);
            return;
        }

        setRejecting(true);

        const { error } = await supabase
            .from("content_pieces")
            .update({ status: "rejected", feedback: trimmed })
            .eq("id", item.id);

        setRejecting(false);

        if (error) {
            toast.error(t.toastRejectError);
            return;
        }

        setItem((prev) =>
            prev ? { ...prev, status: "rejected", feedback: trimmed } : prev
        );
        setActionDone(true);
        toast.success(t.toastRejected);
    }

    // ── Render states ─────────────────────────────────────────────────────────

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <SpinnerIcon className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (notFound || !item) return <NotFound />;

    const isBusy = approving || rejecting;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-sm">
                <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                asChild
                                title={t.backToPanel}
                            >
                                <Link href="/">
                                    <ArrowLeftIcon className="size-4" />
                                </Link>
                            </Button>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-primary shadow-sm">
                                <FilmSlateIcon className="size-5 text-primary-foreground" />
                            </div>
                            <div>
                                <p className="font-heading text-sm font-semibold leading-tight text-foreground">
                                    {t.appName}
                                </p>
                                <p className="text-xs text-muted-foreground">{t.reviewSubtitle}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            {/* Language toggle */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setLocale(locale === "es" ? "en" : "es")}
                                title={locale === "es" ? "Switch to English" : "Cambiar a Español"}
                            >
                                <GlobeIcon className="size-4" />
                                <span className="text-xs font-medium">{locale === "es" ? "EN" : "ES"}</span>
                            </Button>

                            {/* Theme toggle */}
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                title={t.toggleTheme}
                            >
                                <SunIcon className="size-4 dark:hidden" />
                                <MoonIcon className="hidden size-4 dark:block" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
                <div className="flex flex-col gap-6">

                    {/* Title block */}
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <h1 className="font-heading text-2xl font-semibold leading-tight text-foreground">
                                {item.title}
                            </h1>
                            <Badge variant="outline" className={cn(STATUS_BADGE_CLASS[item.status])}>
                                {STATUS_LABEL[item.status]}
                            </Badge>
                        </div>
                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <ClockIcon className="size-3.5" />
                            {t.publishedOn} {formatDate(item.created_at, locale)}
                        </p>
                    </div>

                    {/* Video */}
                    <VideoPlayer url={item.video_url} />

                    {/* Decision card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.decisionTitle}</CardTitle>
                            <CardDescription>
                                {actionDone ? t.decisionDescDone : t.decisionDescPending}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-4">
                            {/* Banner si ya fue resuelto */}
                            {actionDone && item.status !== "pending" && (
                                <ActionBanner status={item.status as "approved" | "rejected"} />
                            )}

                            {/* Feedback guardado en rechazo */}
                            {item.status === "rejected" && item.feedback && (
                                <div className="flex flex-col gap-1.5">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                        {t.sentFeedback}
                                    </p>
                                    <blockquote className="rounded-xl border-l-4 border-red-400/60 bg-red-50/50 pl-4 pr-4 py-3 text-sm italic text-foreground dark:bg-red-950/20">
                                        "{item.feedback}"
                                    </blockquote>
                                </div>
                            )}

                            {/* Formulario de rechazo */}
                            {!actionDone && showRejectForm && (
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="feedback"
                                        className="text-sm font-medium text-foreground"
                                    >
                                        {t.feedbackLabel}{" "}
                                        <span className="text-destructive" aria-hidden>*</span>
                                    </label>
                                    <Textarea
                                        id="feedback"
                                        placeholder={t.feedbackPlaceholder}
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        disabled={rejecting}
                                        rows={4}
                                    />
                                    <p className="text-right text-xs text-muted-foreground">
                                        {feedback.trim().length} {t.characters}
                                    </p>
                                </div>
                            )}
                        </CardContent>

                        {!actionDone && (
                            <>
                                <Separator />
                                <CardFooter className="flex flex-wrap gap-3 pt-5">
                                    {!showRejectForm ? (
                                        <>
                                            <Button onClick={handleApprove} disabled={isBusy}>
                                                {approving ? (
                                                    <SpinnerIcon data-icon="inline-start" className="animate-spin" />
                                                ) : (
                                                    <CheckCircleIcon data-icon="inline-start" />
                                                )}
                                                {approving ? t.approvingBtn : t.approveBtn}
                                            </Button>

                                            <Button
                                                variant="destructive"
                                                onClick={() => setShowRejectForm(true)}
                                                disabled={isBusy}
                                            >
                                                <XCircleIcon data-icon="inline-start" />
                                                {t.rejectBtn}
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="destructive"
                                                onClick={handleReject}
                                                disabled={rejecting || !feedback.trim()}
                                            >
                                                {rejecting ? (
                                                    <SpinnerIcon data-icon="inline-start" className="animate-spin" />
                                                ) : (
                                                    <XCircleIcon data-icon="inline-start" />
                                                )}
                                                {rejecting ? t.sendingBtn : t.confirmRejectBtn}
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    setShowRejectForm(false);
                                                    setFeedback("");
                                                }}
                                                disabled={rejecting}
                                            >
                                                {t.cancelBtn}
                                            </Button>
                                        </>
                                    )}
                                </CardFooter>
                            </>
                        )}
                    </Card>
                </div>
            </main>
        </div>
    );
}
