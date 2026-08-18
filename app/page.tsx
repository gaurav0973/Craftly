import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
    const { userId } = await auth();

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: "var(--background)" }}
        >
            {/* ── Navbar ─────────────────────────────────────────────── */}
            <header
                style={{
                    background: "var(--background)",
                    borderBottom: "2px solid var(--border)",
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                }}
            >
                <div
                    style={{
                        maxWidth: "1100px",
                        margin: "0 auto",
                        padding: "0 1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: "4rem",
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
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                background: "var(--accent)",
                                border: "2px solid var(--foreground)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "2px 2px 0px var(--foreground)",
                            }}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="white"
                            >
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </span>
                        <span
                            style={{
                                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                fontWeight: 800,
                                fontSize: "1.3rem",
                                color: "var(--foreground)",
                            }}
                        >
                            Craft
                            <span style={{ color: "var(--accent)" }}>ly</span>
                        </span>
                    </Link>

                    {/* Nav actions */}
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        {userId ? (
                            <>
                                <Link href="/projects" className="btn-primary" style={{ fontSize: "0.85rem", padding: "0.5rem 1.2rem" }}>
                                    My Projects →
                                </Link>
                                <UserButton />
                            </>
                        ) : (
                            <>
                                <Link href="/sign-in" className="btn-secondary" style={{ fontSize: "0.85rem", padding: "0.5rem 1.2rem" }}>
                                    Sign In
                                </Link>
                                <Link href="/sign-in" className="btn-primary" style={{ fontSize: "0.85rem", padding: "0.5rem 1.2rem" }}>
                                    Get Started →
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main style={{ flex: 1 }}>
                {/* ── Hero Section ─────────────────────────────────────── */}
                <section
                    style={{
                        maxWidth: "1100px",
                        margin: "0 auto",
                        padding: "5rem 1.5rem 4rem",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "4rem",
                        alignItems: "center",
                        position: "relative",
                    }}
                >
                    {/* Big amber circle decoration */}
                    <div
                        style={{
                            position: "absolute",
                            top: "2rem",
                            left: "-3rem",
                            width: "420px",
                            height: "420px",
                            borderRadius: "50%",
                            background: "var(--tertiary)",
                            opacity: 0.15,
                            zIndex: 0,
                            pointerEvents: "none",
                        }}
                    />

                    {/* Left — Text */}
                    <div style={{ position: "relative", zIndex: 1 }}>
                        <div className="animate-bounce-in" style={{ animationDelay: "0ms" }}>
                            <span className="badge" style={{ marginBottom: "1.25rem", display: "inline-flex" }}>
                                ✨ Powered by Gemini AI
                            </span>
                        </div>

                        <h1
                            className="animate-slide-up"
                            style={{
                                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
                                fontWeight: 800,
                                color: "var(--foreground)",
                                lineHeight: 1.1,
                                marginBottom: "1.25rem",
                                animationDelay: "100ms",
                            }}
                        >
                            Build Apps.{" "}
                            <span className="squiggle-underline" style={{ color: "var(--accent)" }}>
                                Just Describe.
                            </span>
                        </h1>

                        <p
                            className="animate-slide-up"
                            style={{
                                fontSize: "1.1rem",
                                color: "var(--muted-foreground)",
                                lineHeight: 1.7,
                                marginBottom: "2rem",
                                maxWidth: "480px",
                                animationDelay: "200ms",
                            }}
                        >
                            Type what you want to build. Craftly's AI writes the code,
                            spins up a live preview, and delivers a fully working app —
                            instantly.
                        </p>

                        <div
                            className="animate-slide-up"
                            style={{
                                display: "flex",
                                gap: "0.75rem",
                                flexWrap: "wrap",
                                animationDelay: "300ms",
                            }}
                        >
                            <Link href={userId ? "/projects" : "/sign-in"} className="btn-primary">
                                <span>Start Building</span>
                                <span
                                    style={{
                                        width: "24px",
                                        height: "24px",
                                        borderRadius: "50%",
                                        background: "white",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
                                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </Link>
                            <a
                                href="#features"
                                className="btn-secondary"
                            >
                                See how it works
                            </a>
                        </div>

                        {/* Social proof */}
                        <div
                            className="animate-slide-up"
                            style={{
                                marginTop: "2.5rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                animationDelay: "400ms",
                            }}
                        >
                            <div style={{ display: "flex" }}>
                                {["#8B5CF6", "#F472B6", "#FBBF24", "#34D399"].map((c, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "50%",
                                            background: c,
                                            border: "2px solid var(--background)",
                                            marginLeft: i === 0 ? 0 : "-8px",
                                        }}
                                    />
                                ))}
                            </div>
                            <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", fontWeight: 500 }}>
                                Join <strong style={{ color: "var(--foreground)" }}>1,000+</strong> builders using Craftly
                            </span>
                        </div>
                    </div>

                    {/* Right — Mock UI Card */}
                    <div
                        style={{ position: "relative", zIndex: 1 }}
                        className="animate-float"
                    >
                        {/* Dot grid backdrop */}
                        <div
                            className="dot-grid"
                            style={{
                                position: "absolute",
                                inset: "-20px",
                                borderRadius: "var(--radius-lg)",
                                zIndex: 0,
                            }}
                        />
                        {/* Mock card */}
                        <div
                            style={{
                                position: "relative",
                                zIndex: 1,
                                background: "white",
                                border: "2px solid var(--foreground)",
                                borderRadius: "var(--radius-lg)",
                                boxShadow: "var(--shadow-pop-hover)",
                                padding: "1.5rem",
                                maxWidth: "420px",
                                margin: "0 auto",
                            }}
                        >
                            {/* Browser chrome */}
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1rem" }}>
                                {["#ef4444", "#fbbf24", "#34d399"].map((c, i) => (
                                    <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, border: "1.5px solid rgba(0,0,0,0.15)" }} />
                                ))}
                                <div style={{ flex: 1, height: "24px", background: "var(--muted)", borderRadius: "6px", marginLeft: "0.5rem" }} />
                            </div>

                            {/* Prompt input mock */}
                            <div
                                style={{
                                    background: "var(--muted)",
                                    borderRadius: "var(--radius-md)",
                                    padding: "1rem",
                                    marginBottom: "1rem",
                                    border: "1.5px solid var(--border)",
                                }}
                            >
                                <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", margin: 0, fontStyle: "italic" }}>
                                    "Build me a todo app with dark mode and local storage..."
                                </p>
                            </div>

                            {/* Generating animation */}
                            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                                {[
                                    { color: "var(--accent)", label: "Writing code..." },
                                    { color: "var(--quaternary)", label: "Done ✓" },
                                ].map((step, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            flex: 1,
                                            background: step.color + "22",
                                            border: `1.5px solid ${step.color}`,
                                            borderRadius: "var(--radius-sm)",
                                            padding: "0.4rem 0.6rem",
                                            fontSize: "0.7rem",
                                            fontWeight: 600,
                                            color: step.color === "var(--accent)" ? "var(--accent)" : "#059669",
                                        }}
                                    >
                                        {step.label}
                                    </div>
                                ))}
                            </div>

                            {/* Mini preview */}
                            <div
                                style={{
                                    background: "#1e293b",
                                    borderRadius: "var(--radius-md)",
                                    padding: "1rem",
                                    height: "120px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.5rem",
                                }}
                            >
                                <div style={{ height: "12px", background: "#334155", borderRadius: "4px", width: "60%" }} />
                                <div style={{ height: "8px", background: "#334155", borderRadius: "4px", width: "80%" }} />
                                <div style={{ height: "8px", background: "#334155", borderRadius: "4px", width: "45%" }} />
                                <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
                                    <div style={{ height: "28px", flex: 1, background: "var(--accent)", borderRadius: "6px" }} />
                                    <div style={{ height: "28px", width: "28px", background: "#475569", borderRadius: "6px" }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Marquee ──────────────────────────────────────────── */}
                <div
                    style={{
                        borderTop: "2px solid var(--border)",
                        borderBottom: "2px solid var(--border)",
                        background: "var(--foreground)",
                        padding: "0.8rem 0",
                        overflow: "hidden",
                    }}
                >
                    <div className="animate-marquee">
                        {[...Array(2)].map((_, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "2rem", paddingRight: "2rem" }}>
                                {["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js", "PostgreSQL", "AI-Powered", "Live Preview", "Instant Deploy", "Export Code", "React", "TypeScript", "Next.js", "Tailwind CSS"].map((item, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                            fontWeight: 700,
                                            fontSize: "0.85rem",
                                            color: ["white", "var(--tertiary)", "var(--secondary)", "var(--quaternary)"][i % 4] as string,
                                            letterSpacing: "0.05em",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {i % 2 === 0 ? "★" : "◆"} {item}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Features Section ──────────────────────────────────── */}
                <section
                    id="features"
                    style={{
                        maxWidth: "1100px",
                        margin: "0 auto",
                        padding: "5rem 1.5rem",
                    }}
                >
                    <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                        <span className="badge" style={{ marginBottom: "1rem", display: "inline-flex" }}>
                            🛠 How It Works
                        </span>
                        <h2
                            style={{
                                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                                fontWeight: 800,
                                color: "var(--foreground)",
                            }}
                        >
                            Three steps to your app
                        </h2>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "1.5rem",
                            position: "relative",
                        }}
                    >
                        {/* Dashed connector line */}
                        <div
                            style={{
                                position: "absolute",
                                top: "3.5rem",
                                left: "20%",
                                right: "20%",
                                height: "2px",
                                background: "none",
                                borderTop: "2px dashed var(--border)",
                                zIndex: 0,
                                pointerEvents: "none",
                            }}
                        />

                        {[
                            {
                                icon: "✍️",
                                color: "var(--accent)",
                                num: "01",
                                title: "Describe Your App",
                                body: "Type a plain-English description of the app you want. Be as detailed or as vague as you like — Craftly figures out the rest.",
                            },
                            {
                                icon: "⚡",
                                color: "var(--secondary)",
                                num: "02",
                                title: "AI Writes the Code",
                                body: "Gemini AI plans, scaffolds, and writes production-ready code in a live E2B sandbox. Fully functional in seconds.",
                            },
                            {
                                icon: "🚀",
                                color: "var(--quaternary)",
                                num: "03",
                                title: "Preview & Iterate",
                                body: "See your app running live instantly. Send follow-up messages to refine, add features, or fix bugs — conversationally.",
                            },
                        ].map((feat, i) => (
                            <div
                                key={i}
                                className="card-sticker animate-wiggle"
                                style={{
                                    padding: "2rem 1.5rem 1.5rem",
                                    position: "relative",
                                    zIndex: 1,
                                    animationDelay: `${i * 100}ms`,
                                }}
                            >
                                {/* Floating icon circle */}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "-20px",
                                        left: "1.5rem",
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "50%",
                                        background: feat.color,
                                        border: "2px solid var(--foreground)",
                                        boxShadow: "3px 3px 0px var(--foreground)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "1.3rem",
                                    }}
                                >
                                    {feat.icon}
                                </div>

                                <div
                                    style={{
                                        fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                        fontWeight: 800,
                                        fontSize: "2.5rem",
                                        color: feat.color,
                                        opacity: 0.2,
                                        position: "absolute",
                                        top: "0.75rem",
                                        right: "1rem",
                                        lineHeight: 1,
                                    }}
                                >
                                    {feat.num}
                                </div>

                                <h3
                                    style={{
                                        fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                        fontWeight: 700,
                                        fontSize: "1.1rem",
                                        marginTop: "1.5rem",
                                        marginBottom: "0.6rem",
                                        color: "var(--foreground)",
                                    }}
                                >
                                    {feat.title}
                                </h3>
                                <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", lineHeight: 1.6, margin: 0 }}>
                                    {feat.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── CTA Section ──────────────────────────────────────── */}
                <section
                    style={{
                        background: "var(--foreground)",
                        padding: "5rem 1.5rem",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Decorative circles */}
                    {[
                        { color: "#8B5CF6", size: 200, top: "-80px", right: "10%" },
                        { color: "#F472B6", size: 120, bottom: "-40px", left: "5%" },
                        { color: "#FBBF24", size: 80, top: "50%", right: "30%" },
                    ].map((d, i) => (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                width: d.size,
                                height: d.size,
                                borderRadius: "50%",
                                background: d.color,
                                opacity: 0.15,
                                top: d.top,
                                right: d.right,
                                bottom: (d as any).bottom,
                                left: (d as any).left,
                                pointerEvents: "none",
                            }}
                        />
                    ))}

                    <div
                        style={{
                            maxWidth: "640px",
                            margin: "0 auto",
                            textAlign: "center",
                            position: "relative",
                            zIndex: 1,
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                fontSize: "3rem",
                                display: "block",
                                marginBottom: "1rem",
                            }}
                        >
                            🎉
                        </span>
                        <h2
                            style={{
                                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                                fontWeight: 800,
                                color: "white",
                                marginBottom: "1rem",
                            }}
                        >
                            Ready to build something{" "}
                            <span style={{ color: "var(--tertiary)" }}>amazing?</span>
                        </h2>
                        <p
                            style={{
                                fontSize: "1.05rem",
                                color: "#94a3b8",
                                marginBottom: "2rem",
                                lineHeight: 1.7,
                            }}
                        >
                            No credit card required. No setup. Just describe your idea and
                            watch Craftly build it for you.
                        </p>
                        <Link href={userId ? "/projects" : "/sign-in"} className="btn-primary" style={{ fontSize: "1.05rem", padding: "0.8rem 2rem" }}>
                            <span>Build Your First App</span>
                            <span
                                style={{
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "50%",
                                    background: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </Link>
                    </div>
                </section>
            </main>

            {/* ── Footer ──────────────────────────────────────────────── */}
            <footer
                style={{
                    background: "var(--muted)",
                    borderTop: "2px solid var(--border)",
                    padding: "1.5rem",
                    textAlign: "center",
                }}
            >
                <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", margin: 0 }}>
                    Built with ❤️ and{" "}
                    <span style={{ color: "var(--accent)", fontWeight: 600 }}>Craftly</span>{" "}
                    © {new Date().getFullYear()}
                </p>
            </footer>
        </div>
    );
}
