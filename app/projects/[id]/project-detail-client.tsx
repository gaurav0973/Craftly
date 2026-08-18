"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useGetMessages, useCreateMessage } from "@/features/message/hooks/message";
import { MarkdownMessage } from "@/components/chat/markdown-message";
import { CodeEditorView } from "@/components/editor/code-editor-view";
import { ArrowLeft, Play, Code2, ExternalLink, Sparkles, Send, Check } from "lucide-react";

interface Fragment {
    id: string;
    sandboxUrl: string;
    title: string;
    files: Record<string, string>;
}

interface Message {
    id: string;
    content: string;
    role: "USER" | "ASSISTANT";
    type: "RESULT" | "ERROR";
    fragments?: Fragment | null;
    createdAt: Date | string;
}

interface Project {
    id: string;
    name: string;
    createdAt: Date | string;
    messages: Message[];
}

interface ProjectDetailClientProps {
    project: Project;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
    const [newMessage, setNewMessage] = useState("");
    const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { data: messages, isLoading: messagesLoading } = useGetMessages(project.id);
    const createMessage = useCreateMessage(project.id);

    // Auto-scroll chat to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || createMessage.isPending) return;
        const content = newMessage.trim();
        setNewMessage("");
        await createMessage.mutateAsync(content);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSend(e as unknown as React.FormEvent);
        }
    };

    // Find the latest assistant message with a fragment (sandbox preview)
    const allMessages = (messages ?? project.messages) as Message[];
    const latestFragment = [...allMessages]
        .reverse()
        .find((m) => m.role === "ASSISTANT" && m.fragments?.sandboxUrl)?.fragments;

    // Determine if AI is currently processing
    const lastMessage = allMessages[allMessages.length - 1];
    const isProcessing =
        createMessage.isPending ||
        (lastMessage?.role === "USER" &&
            allMessages.filter((m) => m.role === "ASSISTANT").length <
            allMessages.filter((m) => m.role === "USER").length);

    return (
        <div
            style={{
                display: "flex",
                height: "calc(100vh - 3.5rem)",
                overflow: "hidden",
            }}
        >
            {/* ── Left Panel: Chat ──────────────────────────────── */}
            <div
                style={{
                    width: "380px",
                    minWidth: "340px",
                    maxWidth: "420px",
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    borderRight: "2px solid var(--border)",
                    background: "white",
                }}
            >
                {/* Chat header */}
                <div
                    style={{
                        padding: "1rem 1.25rem",
                        borderBottom: "2px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        background: "var(--background)",
                    }}
                >
                    <Link
                        href="/projects"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "32px",
                            height: "32px",
                            borderRadius: "var(--radius-sm)",
                            border: "2px solid var(--foreground)",
                            background: "white",
                            boxShadow: "2px 2px 0px var(--foreground)",
                            cursor: "pointer",
                            textDecoration: "none",
                            color: "var(--foreground)",
                            transition: "all 0.2s",
                            flexShrink: 0,
                        }}
                        title="Back to projects"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div style={{ minWidth: 0 }}>
                        <h2
                            style={{
                                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                fontWeight: 700,
                                fontSize: "0.95rem",
                                color: "var(--foreground)",
                                margin: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {project.name}
                        </h2>
                        <p style={{ fontSize: "0.7rem", color: "var(--muted-foreground)", margin: 0 }}>
                            {isProcessing ? (
                                <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                                    ⚡ Building...
                                </span>
                            ) : (
                                `${allMessages.length} message${allMessages.length !== 1 ? "s" : ""}`
                            )}
                        </p>
                    </div>
                </div>

                {/* Messages list */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                    }}
                >
                    {messagesLoading && allMessages.length === 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        height: "60px",
                                        background: "var(--muted)",
                                        borderRadius: "var(--radius-md)",
                                        animation: "pulse-glow 1.5s ease infinite",
                                        animationDelay: `${i * 200}ms`,
                                        alignSelf: i % 2 === 0 ? "flex-end" : "flex-start",
                                        width: "75%",
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {allMessages.map((msg) => (
                        <div
                            key={msg.id}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: msg.role === "USER" ? "flex-end" : "flex-start",
                                gap: "0.25rem",
                                animation: "slide-up 0.3s ease both",
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: "88%",
                                    padding: "0.75rem 1rem",
                                    borderRadius:
                                        msg.role === "USER"
                                            ? "var(--radius-md) var(--radius-md) 4px var(--radius-md)"
                                            : "var(--radius-md) var(--radius-md) var(--radius-md) 4px",
                                    background:
                                        msg.role === "USER"
                                            ? "var(--accent)"
                                            : msg.type === "ERROR"
                                            ? "#fef2f2"
                                            : "#ffffff",
                                    border:
                                        msg.role === "USER"
                                            ? "2px solid var(--foreground)"
                                            : `2px solid ${msg.type === "ERROR" ? "#fca5a5" : "#e2e8f0"}`,
                                    boxShadow:
                                        msg.role === "USER"
                                            ? "3px 3px 0px var(--foreground)"
                                            : "2px 2px 0px rgba(0,0,0,0.05)",
                                    color:
                                        msg.role === "USER"
                                            ? "white"
                                            : msg.type === "ERROR"
                                            ? "#dc2626"
                                            : "var(--foreground)",
                                }}
                            >
                                <MarkdownMessage
                                    content={msg.content}
                                    isUser={msg.role === "USER"}
                                />
                            </div>

                            {/* Fragment title pill */}
                            {msg.fragments?.title && (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.4rem",
                                        background: "var(--quaternary)" + "22",
                                        border: "1.5px solid var(--quaternary)",
                                        borderRadius: "var(--radius-full)",
                                        padding: "0.2rem 0.65rem",
                                        fontSize: "0.7rem",
                                        fontWeight: 600,
                                        color: "#059669",
                                    }}
                                >
                                    <span>✓</span> {msg.fragments.title}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Processing indicator */}
                    {isProcessing && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "0.5rem",
                            }}
                        >
                            <div
                                style={{
                                    padding: "0.75rem 1rem",
                                    borderRadius: "var(--radius-md) var(--radius-md) var(--radius-md) 4px",
                                    background: "var(--muted)",
                                    border: "2px solid var(--border)",
                                    boxShadow: "2px 2px 0px var(--border)",
                                    display: "flex",
                                    gap: "0.35rem",
                                    alignItems: "center",
                                }}
                            >
                                {[0, 1, 2].map((i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: "7px",
                                            height: "7px",
                                            borderRadius: "50%",
                                            background: "var(--accent)",
                                            animation: "pulse-glow 1s ease infinite",
                                            animationDelay: `${i * 200}ms`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <form
                    onSubmit={handleSend}
                    style={{
                        borderTop: "2px solid var(--border)",
                        padding: "0.75rem",
                        background: "var(--background)",
                    }}
                >
                    <div
                        style={{
                            background: "white",
                            border: "2px solid var(--border-input)",
                            borderRadius: "var(--radius-md)",
                            overflow: "hidden",
                            transition: "border-color 0.2s, box-shadow 0.2s",
                        }}
                        onFocusCapture={(e) => {
                            (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)";
                            (e.currentTarget as HTMLDivElement).style.boxShadow = "3px 3px 0px var(--accent)";
                        }}
                        onBlurCapture={(e) => {
                            (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-input)";
                            (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                        }}
                    >
                        <textarea
                            id="chat-message-input"
                            ref={textareaRef}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Follow-up instructions..."
                            rows={2}
                            style={{
                                width: "100%",
                                border: "none",
                                outline: "none",
                                padding: "0.65rem 0.85rem 0.35rem",
                                fontFamily: "var(--font-plus-jakarta), Plus Jakarta Sans, sans-serif",
                                fontSize: "0.875rem",
                                color: "var(--foreground)",
                                resize: "none",
                                background: "transparent",
                            }}
                        />
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "0.35rem 0.75rem 0.5rem",
                            }}
                        >
                            <span style={{ fontSize: "0.65rem", color: "var(--muted-foreground)" }}>
                                ⌘+Enter
                            </span>
                            <button
                                id="send-message-btn"
                                type="submit"
                                disabled={!newMessage.trim() || createMessage.isPending}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "var(--radius-sm)",
                                    background: newMessage.trim() ? "var(--accent)" : "var(--muted)",
                                    border: `2px solid ${newMessage.trim() ? "var(--foreground)" : "var(--border)"}`,
                                    boxShadow: newMessage.trim() ? "2px 2px 0px var(--foreground)" : "none",
                                    cursor: newMessage.trim() ? "pointer" : "not-allowed",
                                    transition: "all 0.2s",
                                    flexShrink: 0,
                                }}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={newMessage.trim() ? "white" : "var(--muted-foreground)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* ── Right Panel: Sandbox Preview ──────────────────── */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    background: "var(--muted)",
                    overflow: "hidden",
                }}
            >
                {latestFragment ? (
                    <>
                        {/* Preview header */}
                        <div
                            style={{
                                padding: "0.6rem 1rem",
                                borderBottom: "2px solid var(--border)",
                                background: "white",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                            }}
                        >
                            {/* Tab buttons */}
                            <div
                                style={{
                                    display: "flex",
                                    background: "var(--muted)",
                                    border: "2px solid var(--border)",
                                    borderRadius: "var(--radius-sm)",
                                    padding: "2px",
                                    gap: "2px",
                                }}
                            >
                                    <button
                                        key="preview"
                                        id="tab-preview"
                                        onClick={() => setActiveTab("preview")}
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "0.35rem",
                                            padding: "0.35rem 0.85rem",
                                            borderRadius: "4px",
                                            border: "none",
                                            background: activeTab === "preview" ? "white" : "transparent",
                                            color: activeTab === "preview" ? "var(--foreground)" : "var(--muted-foreground)",
                                            fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                            fontWeight: 700,
                                            fontSize: "0.78rem",
                                            cursor: "pointer",
                                            boxShadow: activeTab === "preview" ? "1px 1px 0px var(--border)" : "none",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        <Play size={13} fill={activeTab === "preview" ? "var(--accent)" : "none"} color={activeTab === "preview" ? "var(--accent)" : "currentColor"} />
                                        <span>Preview</span>
                                    </button>
                                    <button
                                        key="code"
                                        id="tab-code"
                                        onClick={() => setActiveTab("code")}
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "0.35rem",
                                            padding: "0.35rem 0.85rem",
                                            borderRadius: "4px",
                                            border: "none",
                                            background: activeTab === "code" ? "white" : "transparent",
                                            color: activeTab === "code" ? "var(--foreground)" : "var(--muted-foreground)",
                                            fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                            fontWeight: 700,
                                            fontSize: "0.78rem",
                                            cursor: "pointer",
                                            boxShadow: activeTab === "code" ? "1px 1px 0px var(--border)" : "none",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        <Code2 size={14} color={activeTab === "code" ? "var(--accent)" : "currentColor"} />
                                        <span>Code</span>
                                        {latestFragment.files && Object.keys(latestFragment.files).length > 0 && (
                                            <span
                                                style={{
                                                    background: activeTab === "code" ? "var(--accent)" : "#cbd5e1",
                                                    color: activeTab === "code" ? "white" : "#475569",
                                                    fontSize: "0.68rem",
                                                    fontWeight: 700,
                                                    padding: "0.1rem 0.4rem",
                                                    borderRadius: "999px",
                                                    marginLeft: "0.2rem",
                                                }}
                                            >
                                                {Object.keys(latestFragment.files).length}
                                            </span>
                                        )}
                                    </button>
                            </div>

                            {/* Fragment title */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.4rem",
                                    flex: 1,
                                    minWidth: 0,
                                }}
                            >
                                <div
                                    style={{
                                        width: "8px",
                                        height: "8px",
                                        borderRadius: "50%",
                                        background: "var(--quaternary)",
                                        animation: "pulse-glow 2s ease infinite",
                                        flexShrink: 0,
                                    }}
                                />
                                <span
                                    style={{
                                        fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                        fontWeight: 700,
                                        fontSize: "0.8rem",
                                        color: "var(--foreground)",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {latestFragment.title}
                                </span>
                            </div>

                            {/* Open in new tab */}
                            <a
                                id="open-sandbox-external"
                                href={latestFragment.sandboxUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open in new tab"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "var(--radius-sm)",
                                    border: "2px solid var(--border)",
                                    background: "var(--muted)",
                                    cursor: "pointer",
                                    textDecoration: "none",
                                    color: "var(--muted-foreground)",
                                    transition: "all 0.2s",
                                    flexShrink: 0,
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLAnchorElement).style.background = "var(--foreground)";
                                    (e.currentTarget as HTMLAnchorElement).style.color = "white";
                                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--foreground)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLAnchorElement).style.background = "var(--muted)";
                                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted-foreground)";
                                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                                }}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                            </a>
                        </div>

                        {/* Content area */}
                        <div style={{ flex: 1, overflow: "hidden" }}>
                            {activeTab === "preview" ? (
                                <iframe
                                    id="sandbox-preview"
                                    src={latestFragment.sandboxUrl}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        border: "none",
                                    }}
                                    title={latestFragment.title}
                                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                                />
                            ) : (
                                <CodeEditorView files={latestFragment.files || {}} />
                            )}
                        </div>
                    </>
                ) : (
                    /* No fragment yet — waiting state */
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "1.5rem",
                            padding: "2rem",
                        }}
                    >
                        {isProcessing ? (
                            <>
                                <div
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        borderRadius: "50%",
                                        border: "3px solid var(--accent)",
                                        borderTopColor: "transparent",
                                        animation: "spin-slow 1s linear infinite",
                                    }}
                                />
                                <div style={{ textAlign: "center" }}>
                                    <h3
                                        style={{
                                            fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                            fontWeight: 700,
                                            fontSize: "1.3rem",
                                            color: "var(--foreground)",
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        Building your app...
                                    </h3>
                                    <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)" }}>
                                        Craftly is writing code in a live sandbox. This usually takes 30–60 seconds.
                                    </p>
                                </div>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    {["Writing files", "Installing deps", "Starting server"].map((step, i) => (
                                        <div
                                            key={step}
                                            style={{
                                                padding: "0.3rem 0.75rem",
                                                borderRadius: "var(--radius-full)",
                                                background: "var(--accent)" + "22",
                                                border: "1.5px solid var(--accent)",
                                                fontSize: "0.75rem",
                                                fontWeight: 600,
                                                color: "var(--accent)",
                                                animation: "pulse-glow 1.5s ease infinite",
                                                animationDelay: `${i * 400}ms`,
                                            }}
                                        >
                                            {step}
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <div
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        borderRadius: "var(--radius-lg)",
                                        background: "var(--muted)",
                                        border: "2px solid var(--border)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "2rem",
                                        boxShadow: "var(--shadow-card)",
                                    }}
                                >
                                    🖥
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <h3
                                        style={{
                                            fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                            fontWeight: 700,
                                            fontSize: "1.2rem",
                                            color: "var(--foreground)",
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        Preview will appear here
                                    </h3>
                                    <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)" }}>
                                        Once Craftly finishes building, you'll see a live preview of your app.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
