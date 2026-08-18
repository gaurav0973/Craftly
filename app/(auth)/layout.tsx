import Link from "next/link";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "var(--background)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* ── Decorative Shapes ─────────────────────────────── */}

            {/* Large amber circle top-left */}
            <div
                style={{
                    position: "absolute",
                    top: "-100px",
                    left: "-100px",
                    width: "350px",
                    height: "350px",
                    borderRadius: "50%",
                    background: "var(--tertiary)",
                    opacity: 0.2,
                    pointerEvents: "none",
                }}
            />

            {/* Pink square bottom-right */}
            <div
                style={{
                    position: "absolute",
                    bottom: "-60px",
                    right: "-60px",
                    width: "280px",
                    height: "280px",
                    borderRadius: "var(--radius-lg)",
                    background: "var(--secondary)",
                    opacity: 0.15,
                    transform: "rotate(20deg)",
                    pointerEvents: "none",
                }}
            />

            {/* Violet circle mid-right */}
            <div
                style={{
                    position: "absolute",
                    top: "30%",
                    right: "8%",
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background: "var(--accent)",
                    opacity: 0.12,
                    pointerEvents: "none",
                }}
            />

            {/* Dot grid bottom-left */}
            <div
                className="dot-grid"
                style={{
                    position: "absolute",
                    bottom: "5%",
                    left: "5%",
                    width: "200px",
                    height: "200px",
                    pointerEvents: "none",
                    opacity: 0.6,
                }}
            />

            {/* ── Brand Logo ────────────────────────────────────── */}
            <Link
                href="/"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    textDecoration: "none",
                    marginBottom: "1.5rem",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <span
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "var(--accent)",
                        border: "2px solid var(--foreground)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "3px 3px 0px var(--foreground)",
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </span>
                <span
                    style={{
                        fontFamily: "var(--font-outfit), Outfit, sans-serif",
                        fontWeight: 800,
                        fontSize: "1.6rem",
                        color: "var(--foreground)",
                    }}
                >
                    Craft<span style={{ color: "var(--accent)" }}>ly</span>
                </span>
            </Link>

            {/* ── Clerk Component ───────────────────────────────── */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                }}
                className="animate-pop-in"
            >
                {children}
            </div>

            {/* ── Footer note ──────────────────────────────────── */}
            <p
                style={{
                    marginTop: "1.5rem",
                    fontSize: "0.8rem",
                    color: "var(--muted-foreground)",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                By signing in you agree to our{" "}
                <span style={{ color: "var(--accent)", fontWeight: 600, cursor: "pointer" }}>Terms</span>{" "}
                &{" "}
                <span style={{ color: "var(--accent)", fontWeight: 600, cursor: "pointer" }}>Privacy Policy</span>
            </p>
        </div>
    );
}
