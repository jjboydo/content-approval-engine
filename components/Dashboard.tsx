"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    FilmSlateIcon,
    PlusIcon,
    LinkSimpleIcon,
    SpinnerIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowSquareOutIcon,
    CopySimpleIcon,
    SignOutIcon,
    UserCircleIcon,
    SunIcon,
    MoonIcon,
    GlobeIcon,
} from "@phosphor-icons/react";

import { supabase } from "@/lib/supabase";
import { useLocale, useTheme } from "@/components/providers";
import { translations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_BADGE_CLASS: Record<Status, string> = {
    pending: "border bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
    approved: "border bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
    rejected: "border bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
};

const STATUS_BORDER_CLASS: Record<Status, string> = {
    pending: "border-l-4 border-l-amber-400",
    approved: "border-l-4 border-l-emerald-500",
    rejected: "border-l-4 border-l-red-500",
};

const STAT_PILL_STYLES: Record<Status, { pill: string; icon: string; value: string }> = {
    pending: {
        pill: "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
        icon: "text-amber-600 dark:text-amber-400",
        value: "text-amber-700 dark:text-amber-300",
    },
    approved: {
        pill: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800",
        icon: "text-emerald-600 dark:text-emerald-400",
        value: "text-emerald-700 dark:text-emerald-300",
    },
    rejected: {
        pill: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
        icon: "text-red-600 dark:text-red-400",
        value: "text-red-700 dark:text-red-300",
    },
};

function formatDate(iso: string, locale: string) {
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(iso));
}

async function copyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatPill({
    icon: Icon,
    label,
    value,
    status,
}: {
    icon: React.ElementType;
    label: string;
    value: number;
    status: Status;
}) {
    const styles = STAT_PILL_STYLES[status];
    return (
        <div className={cn("flex items-center gap-2 rounded-xl border px-4 py-3", styles.pill)}>
            <Icon className={cn("size-4", styles.icon)} />
            <div className="flex items-baseline gap-1.5">
                <span className={cn("font-heading text-lg font-semibold tabular-nums", styles.value)}>{value}</span>
                <span className="text-xs text-muted-foreground">{label}</span>
            </div>
        </div>
    );
}

function ContentCard({ item }: { item: ContentPiece }) {
    const { locale } = useLocale();
    const t = translations[locale];
    const statusLabels: Record<Status, string> = {
        pending: t.pending,
        approved: t.approved,
        rejected: t.rejected,
    };
    const reviewUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/review/${item.id}`;

    async function handleCopyLink() {
        const ok = await copyToClipboard(reviewUrl);
        if (ok) toast.success(t.linkCopied);
        else toast.error(t.copyError);
    }

    return (
        <Card className={cn("flex flex-col transition-all hover:shadow-lg", STATUS_BORDER_CLASS[item.status])}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-sm leading-snug">
                        {item.title}
                    </CardTitle>
                    <Badge variant="outline" className={cn("shrink-0", STATUS_BADGE_CLASS[item.status])}>
                        {statusLabels[item.status]}
                    </Badge>
                </div>
                <CardDescription className="flex items-center gap-1 text-xs">
                    <ClockIcon className="size-3" />
                    {formatDate(item.created_at, locale)}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-3 pb-4">
                <a
                    href={item.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 truncate text-xs text-primary underline-offset-4 hover:underline"
                >
                    <ArrowSquareOutIcon className="size-3.5 shrink-0" />
                    <span className="truncate">{item.video_url}</span>
                </a>

                {item.feedback && (
                    <p className="line-clamp-2 rounded-lg bg-muted px-3 py-2 text-xs italic text-muted-foreground">
                        &ldquo;{item.feedback}&rdquo;
                    </p>
                )}
            </CardContent>

            <Separator />

            <CardFooter className="flex items-center justify-between gap-2 pt-3">
                <a
                    href={`/review/${item.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                >
                    <LinkSimpleIcon className="size-3.5 shrink-0" />
                    {t.viewReview}
                </a>
                <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={handleCopyLink}
                    title={t.copyLink}
                >
                    <CopySimpleIcon />
                </Button>
            </CardFooter>
        </Card>
    );
}

function EmptyState() {
    const { locale } = useLocale();
    const t = translations[locale];
    return (
        <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
                    <FilmSlateIcon className="size-7 text-muted-foreground" />
                </div>
                <p className="font-heading text-base font-semibold text-foreground">
                    {t.emptyTitle}
                </p>
                <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
                    {t.emptyDesc}
                </p>
            </CardContent>
        </Card>
    );
}

function SkeletonGrid() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "h-52 animate-pulse rounded-2xl bg-muted",
                        i === 2 && "hidden lg:block"
                    )}
                />
            ))}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Dashboard() {
    const router = useRouter();
    const { locale, setLocale } = useLocale();
    const { theme, setTheme } = useTheme();
    const t = translations[locale];

    // null = loading, array = loaded (may be empty)
    const [items, setItems] = useState<ContentPiece[] | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [signingOut, setSigningOut] = useState(false);
    const [title, setTitle] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserEmail(data.user?.email ?? null);
        });
    }, []);

    async function handleSignOut() {
        setSigningOut(true);
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    }

    const fetchItems = useCallback(() => {
        supabase
            .from("content_pieces")
            .select("*")
            .order("created_at", { ascending: false })
            .then(({ data, error }) => {
                if (error) {
                    setItems((prev) => prev ?? []);
                    return;
                }
                setItems(data ?? []);
            });
    }, []);

    useEffect(() => {
        fetchItems();

        const channel = supabase
            .channel("content_pieces_realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "content_pieces" },
                () => fetchItems()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchItems]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const trimmedTitle = title.trim();
        const trimmedUrl = videoUrl.trim();

        if (!trimmedTitle || !trimmedUrl) {
            toast.error(t.fillFields);
            return;
        }

        setSubmitting(true);

        const { error } = await supabase.from("content_pieces").insert({
            title: trimmedTitle,
            video_url: trimmedUrl,
            status: "pending",
        });

        setSubmitting(false);

        if (error) {
            toast.error(t.createError);
            return;
        }

        toast.success(t.createSuccess);
        setTitle("");
        setVideoUrl("");
    }

    const counts = {
        pending: (items ?? []).filter((i) => i.status === "pending").length,
        approved: (items ?? []).filter((i) => i.status === "approved").length,
        rejected: (items ?? []).filter((i) => i.status === "rejected").length,
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-sm">
                <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-primary shadow-sm">
                                <FilmSlateIcon className="size-5 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="font-heading text-base font-semibold leading-tight text-foreground">
                                    {t.appName}
                                </h1>
                                <p className="text-xs text-muted-foreground">{t.appSubtitle}</p>
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

                            {/* Divider + user email */}
                            {userEmail && (
                                <div className="ml-1 hidden items-center gap-1.5 border-l border-border pl-3 sm:flex">
                                    <UserCircleIcon className="size-4 text-muted-foreground" />
                                    <span className="max-w-45 truncate text-xs text-muted-foreground">
                                        {userEmail}
                                    </span>
                                </div>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSignOut}
                                disabled={signingOut}
                                title={t.signOut}
                            >
                                {signingOut ? (
                                    <SpinnerIcon data-icon="inline-start" className="animate-spin" />
                                ) : (
                                    <SignOutIcon data-icon="inline-start" />
                                )}
                                <span className="hidden sm:inline">
                                    {signingOut ? t.signingOut : t.signOut}
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8">

                    {/* Create Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.newContent}</CardTitle>
                            <CardDescription>{t.newContentDesc}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                                    <div className="flex flex-1 flex-col gap-4 sm:flex-row">
                                        <div className="flex flex-1 flex-col gap-1.5">
                                            <label htmlFor="title" className="text-sm font-medium text-foreground">
                                                {t.titleLabel}
                                            </label>
                                            <Input
                                                id="title"
                                                placeholder={t.titlePlaceholder}
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                disabled={submitting}
                                            />
                                        </div>

                                        <div className="flex flex-1 flex-col gap-1.5">
                                            <label htmlFor="video_url" className="text-sm font-medium text-foreground">
                                                {t.urlLabel}
                                            </label>
                                            <Input
                                                id="video_url"
                                                type="url"
                                                placeholder={t.urlPlaceholder}
                                                value={videoUrl}
                                                onChange={(e) => setVideoUrl(e.target.value)}
                                                disabled={submitting}
                                            />
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={submitting} className="shrink-0">
                                        {submitting ? (
                                            <SpinnerIcon data-icon="inline-start" className="animate-spin" />
                                        ) : (
                                            <PlusIcon data-icon="inline-start" />
                                        )}
                                        {submitting ? t.publishing : t.publish}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Stats + List */}
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="font-heading text-base font-semibold text-foreground">
                                    {t.sentContent}
                                </h2>
                                {items !== null && (
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {items.length} {items.length === 1 ? t.piece : t.pieces} {t.total}
                                    </p>
                                )}
                            </div>

                            {items !== null && items.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    <StatPill icon={ClockIcon} label={t.pendingPlural} value={counts.pending} status="pending" />
                                    <StatPill icon={CheckCircleIcon} label={t.approvedPlural} value={counts.approved} status="approved" />
                                    <StatPill icon={XCircleIcon} label={t.rejectedPlural} value={counts.rejected} status="rejected" />
                                </div>
                            )}
                        </div>

                        {items === null ? (
                            <SkeletonGrid />
                        ) : items.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {items.map((item) => (
                                    <ContentCard key={item.id} item={item} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
