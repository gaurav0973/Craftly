import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { onBoardUserToDatabase } from "@/features/auth/action";

export default async function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Protect: redirect unauthenticated users to sign-in
    const { userId } = await auth();
    if (!userId) {
        redirect("/sign-in");
    }

    // Sync Clerk user to our database on first visit
    await onBoardUserToDatabase();

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "var(--background)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* ── Header ─────────────────────────────────────────── */}
            <header
                style={{
                    background: "white",
                    borderBottom: "2px solid var(--border)",
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                    boxShadow: "0 2px 0px var(--border)",
                }}
            >
                <div
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto",
                        padding: "0 1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: "3.5rem",
                    }}
                >
                    {/* Logo */}
                    <Link
                        href="/"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            textDecoration: "none",
                        }}
                    >
                        <span
                            style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                background: "var(--accent)",
                                border: "2px solid var(--foreground)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "2px 2px 0px var(--foreground)",
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </span>
                        <span
                            style={{
                                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                fontWeight: 800,
                                fontSize: "1.2rem",
                                color: "var(--foreground)",
                            }}
                        >
                            Craft<span style={{ color: "var(--accent)" }}>ly</span>
                        </span>
                    </Link>

                    {/* Nav center */}
                    <nav style={{ display: "flex", gap: "0.25rem" }}>
                        <Link
                            href="/projects"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.4rem",
                                padding: "0.4rem 0.9rem",
                                borderRadius: "var(--radius-full)",
                                background: "var(--accent)",
                                color: "white",
                                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                                textDecoration: "none",
                                border: "2px solid var(--foreground)",
                                boxShadow: "2px 2px 0px var(--foreground)",
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                            Projects
                        </Link>
                    </nav>

                    {/* User button */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: {
                                        width: "34px",
                                        height: "34px",
                                        border: "2px solid var(--foreground)",
                                        boxShadow: "2px 2px 0px var(--foreground)",
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </header>

            {/* ── Main ────────────────────────────────────────────── */}
            <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {children}
            </main>
        </div>
    );
}
