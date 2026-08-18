"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateProject, useGetProjects } from "@/features/projects/hooks/project";

function formatDate(date: string | Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

const CARD_ACCENT_COLORS = [
    "var(--accent)",
    "var(--secondary)",
    "var(--tertiary)",
    "var(--quaternary)",
];

export default function ProjectsPage() {
    const router = useRouter();
    const [prompt, setPrompt] = useState("");
    const { data: projects, isLoading: projectsLoading } = useGetProjects();
    const createProject = useCreateProject();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || createProject.isPending) return;

        const result = await createProject.mutateAsync(prompt.trim());
        if (result && "id" in result) {
            setPrompt("");
            router.push(`/projects/${result.id}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* ── Chatbox Hero ────────────────────────────────────── */}
            <section
                style={{
                    background: "var(--foreground)",
                    padding: "3rem 1.5rem",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Decorations */}
                <div
                    style={{
                        position: "absolute",
                        top: "-60px",
                        right: "-60px",
                        width: "200px",
                        height: "200px",
                        borderRadius: "50%",
                        background: "var(--accent)",
                        opacity: 0.12,
                        pointerEvents: "none",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "-40px",
                        left: "-40px",
                        width: "160px",
                        height: "160px",
                        borderRadius: "var(--radius-lg)",
                        background: "var(--tertiary)",
                        opacity: 0.1,
                        transform: "rotate(15deg)",
                        pointerEvents: "none",
                    }}
                />

                <div
                    style={{
                        maxWidth: "760px",
                        margin: "0 auto",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
                        <h1
                            style={{
                                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                                fontWeight: 800,
                                color: "white",
                                marginBottom: "0.5rem",
                            }}
                        >
                            What do you want to{" "}
                            <span style={{ color: "var(--tertiary)" }}>build</span> today?
                        </h1>
                        <p style={{ fontSize: "0.95rem", color: "#94a3b8" }}>
                            Describe your app idea and Craftly will build it for you.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div
                            style={{
                                background: "white",
                                border: "2px solid var(--foreground)",
                                borderRadius: "var(--radius-lg)",
                                boxShadow: "var(--shadow-pop-hover)",
                                overflow: "hidden",
                            }}
                        >
                            <textarea
                                id="project-prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g. Build me a todo app with dark mode, drag-to-reorder, and local storage persistence..."
                                rows={4}
                                style={{
                                    width: "100%",
                                    border: "none",
                                    outline: "none",
                                    padding: "1.25rem 1.25rem 0.75rem",
                                    fontFamily: "var(--font-plus-jakarta), Plus Jakarta Sans, sans-serif",
                                    fontSize: "0.95rem",
                                    color: "var(--foreground)",
                                    resize: "none",
                                    background: "transparent",
                                }}
                            />

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "0.75rem 1.25rem",
                                    borderTop: "1px solid var(--border)",
                                    background: "var(--muted)",
                                }}
                            >
                                <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                                    ⌘ + Enter to send
                                </span>

                                <button
                                    id="create-project-btn"
                                    type="submit"
                                    disabled={!prompt.trim() || createProject.isPending}
                                    className="btn-primary"
                                    style={{ fontSize: "0.9rem", padding: "0.55rem 1.2rem" }}
                                >
                                    {createProject.isPending ? (
                                        <>
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    width: "14px",
                                                    height: "14px",
                                                    border: "2px solid rgba(255,255,255,0.4)",
                                                    borderTopColor: "white",
                                                    borderRadius: "50%",
                                                    animation: "spin-slow 0.8s linear infinite",
                                                }}
                                            />
                                            Building...
                                        </>
                                    ) : (
                                        <>
                                            Build It
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Suggestion pills */}
                        <div
                            style={{
                                display: "flex",
                                gap: "0.5rem",
                                flexWrap: "wrap",
                                marginTop: "0.75rem",
                                justifyContent: "center",
                            }}
                        >
                            {[
                                "📋 Todo app",
                                "🛒 E-commerce store",
                                "📊 Dashboard with charts",
                                "🎮 Browser game",
                            ].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => setPrompt(suggestion.replace(/^[^\s]+ /, ""))}
                                    style={{
                                        background: "rgba(255,255,255,0.1)",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                        color: "#cbd5e1",
                                        padding: "0.3rem 0.8rem",
                                        borderRadius: "var(--radius-full)",
                                        fontSize: "0.75rem",
                                        cursor: "pointer",
                                        fontFamily: "var(--font-plus-jakarta), Plus Jakarta Sans, sans-serif",
                                        transition: "all 0.2s",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)";
                                        (e.target as HTMLButtonElement).style.color = "white";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
                                        (e.target as HTMLButtonElement).style.color = "#cbd5e1";
                                    }}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </form>
                </div>
            </section>

            {/* ── Projects Grid ────────────────────────────────────── */}
            <section
                style={{
                    flex: 1,
                    maxWidth: "1200px",
                    width: "100%",
                    margin: "0 auto",
                    padding: "2.5rem 1.5rem",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "1.5rem",
                    }}
                >
                    <h2
                        style={{
                            fontFamily: "var(--font-outfit), Outfit, sans-serif",
                            fontSize: "1.3rem",
                            fontWeight: 700,
                            color: "var(--foreground)",
                        }}
                    >
                        Your Projects
                        {projects && !("error" in projects) && projects.length > 0 && (
                            <span
                                style={{
                                    marginLeft: "0.6rem",
                                    background: "var(--accent)",
                                    color: "white",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    padding: "0.15rem 0.55rem",
                                    borderRadius: "var(--radius-full)",
                                    border: "1.5px solid var(--foreground)",
                                    verticalAlign: "middle",
                                }}
                            >
                                {projects.length}
                            </span>
                        )}
                    </h2>
                </div>

                {/* Loading */}
                {projectsLoading && (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                            gap: "1.25rem",
                        }}
                    >
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    height: "160px",
                                    background: "var(--muted)",
                                    border: "2px solid var(--border)",
                                    borderRadius: "var(--radius-md)",
                                    animation: "pulse-glow 1.5s ease infinite",
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!projectsLoading && (!projects || ("error" in projects) || (Array.isArray(projects) && projects.length === 0)) && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "5rem 2rem",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                background: "var(--muted)",
                                border: "2px solid var(--border)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2rem",
                                marginBottom: "1rem",
                                boxShadow: "var(--shadow-card)",
                            }}
                        >
                            🚀
                        </div>
                        <h3
                            style={{
                                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                fontWeight: 700,
                                fontSize: "1.2rem",
                                color: "var(--foreground)",
                                marginBottom: "0.5rem",
                            }}
                        >
                            No projects yet
                        </h3>
                        <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", maxWidth: "340px" }}>
                            Describe your first app idea above and Craftly will build it for you in seconds.
                        </p>
                    </div>
                )}

                {/* Projects grid */}
                {!projectsLoading && projects && !("error" in projects) && Array.isArray(projects) && projects.length > 0 && (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                            gap: "1.25rem",
                        }}
                    >
                        {projects.map((project, i) => {
                            const accentColor = CARD_ACCENT_COLORS[i % CARD_ACCENT_COLORS.length];
                            return (
                                <div
                                    key={project.id}
                                    className="card-sticker animate-wiggle"
                                    style={{ padding: "1.25rem", position: "relative", overflow: "hidden" }}
                                >
                                    {/* Color stripe top */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: "4px",
                                            background: accentColor,
                                        }}
                                    />

                                    {/* Icon */}
                                    <div
                                        style={{
                                            width: "44px",
                                            height: "44px",
                                            borderRadius: "var(--radius-sm)",
                                            background: accentColor + "22",
                                            border: `2px solid ${accentColor}`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginBottom: "0.85rem",
                                            marginTop: "0.5rem",
                                        }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="16 18 22 12 16 6" />
                                            <polyline points="8 6 2 12 8 18" />
                                        </svg>
                                    </div>

                                    <h3
                                        style={{
                                            fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                            fontWeight: 700,
                                            fontSize: "1rem",
                                            color: "var(--foreground)",
                                            marginBottom: "0.35rem",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {project.name}
                                    </h3>

                                    <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginBottom: "1rem" }}>
                                        {formatDate(project.createdAt)}
                                    </p>

                                    <a
                                        href={`/projects/${project.id}`}
                                        id={`open-project-${project.id}`}
                                        className="btn-primary"
                                        style={{
                                            fontSize: "0.8rem",
                                            padding: "0.45rem 1rem",
                                            background: accentColor,
                                            width: "100%",
                                            justifyContent: "center",
                                        }}
                                    >
                                        Open Project →
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
