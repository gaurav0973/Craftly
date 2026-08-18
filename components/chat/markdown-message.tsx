"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy, Terminal, Code2, FileCode } from "lucide-react";

interface MarkdownMessageProps {
    content: string;
    isUser?: boolean;
}

function CodeBlock({
    language,
    value,
}: {
    language: string;
    value: string;
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text", err);
        }
    };

    const displayLanguage = language || "code";

    return (
        <div
            style={{
                margin: "0.75rem 0",
                borderRadius: "12px",
                overflow: "hidden",
                border: "2px solid #334155",
                background: "#1e1e1e",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
            }}
        >
            {/* Code Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.4rem 0.85rem",
                    background: "#252526",
                    borderBottom: "1px solid #334155",
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    {displayLanguage === "bash" || displayLanguage === "sh" ? (
                        <Terminal size={14} color="#38bdf8" />
                    ) : (
                        <FileCode size={14} color="#a78bfa" />
                    )}
                    <span
                        style={{
                            fontFamily: "monospace",
                            fontWeight: 600,
                            textTransform: "lowercase",
                            color: "#e2e8f0",
                        }}
                    >
                        {displayLanguage}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleCopy}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        padding: "0.2rem 0.5rem",
                        background: copied ? "#059669" : "#334155",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                    }}
                >
                    {copied ? (
                        <>
                            <Check size={12} />
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={12} />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code Content */}
            <div style={{ fontSize: "0.85rem", overflowX: "auto" }}>
                <SyntaxHighlighter
                    language={displayLanguage}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: "0.85rem 1rem",
                        background: "#1e1e1e",
                        fontFamily: "JetBrains Mono, Fira Code, Menlo, monospace",
                        fontSize: "0.82rem",
                        lineHeight: 1.6,
                    }}
                    showLineNumbers={value.trim().split("\n").length > 3}
                    lineNumberStyle={{
                        minWidth: "2.2em",
                        paddingRight: "0.8em",
                        color: "#64748b",
                        fontSize: "0.75rem",
                        userSelect: "none",
                    }}
                >
                    {value}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}

export function MarkdownMessage({ content, isUser }: MarkdownMessageProps) {
    if (isUser) {
        return (
            <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {content}
            </div>
        );
    }

    return (
        <div
            style={{
                fontSize: "0.9rem",
                lineHeight: 1.65,
                color: "#1e293b",
                wordBreak: "break-word",
            }}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ children }) => (
                        <h1
                            style={{
                                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                fontSize: "1.25rem",
                                fontWeight: 800,
                                marginTop: "1rem",
                                marginBottom: "0.5rem",
                                color: "#0f172a",
                            }}
                        >
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2
                            style={{
                                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                fontSize: "1.1rem",
                                fontWeight: 700,
                                marginTop: "0.85rem",
                                marginBottom: "0.4rem",
                                color: "#0f172a",
                            }}
                        >
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3
                            style={{
                                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                                fontSize: "1rem",
                                fontWeight: 700,
                                marginTop: "0.75rem",
                                marginBottom: "0.35rem",
                                color: "#0f172a",
                            }}
                        >
                            {children}
                        </h3>
                    ),
                    p: ({ children }) => (
                        <p style={{ margin: "0.45rem 0" }}>{children}</p>
                    ),
                    ul: ({ children }) => (
                        <ul
                            style={{
                                paddingLeft: "1.25rem",
                                margin: "0.5rem 0",
                                listStyleType: "disc",
                            }}
                        >
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol
                            style={{
                                paddingLeft: "1.25rem",
                                margin: "0.5rem 0",
                                listStyleType: "decimal",
                            }}
                        >
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li style={{ margin: "0.25rem 0" }}>{children}</li>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote
                            style={{
                                borderLeft: "4px solid var(--accent)",
                                paddingLeft: "0.75rem",
                                margin: "0.65rem 0",
                                color: "#475569",
                                fontStyle: "italic",
                                background: "rgba(139, 92, 246, 0.05)",
                                padding: "0.4rem 0.75rem",
                                borderRadius: "0 8px 8px 0",
                            }}
                        >
                            {children}
                        </blockquote>
                    ),
                    table: ({ children }) => (
                        <div style={{ overflowX: "auto", margin: "0.75rem 0" }}>
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    fontSize: "0.82rem",
                                    border: "2px solid #cbd5e1",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                }}
                            >
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead style={{ background: "#f1f5f9" }}>{children}</thead>
                    ),
                    th: ({ children }) => (
                        <th
                            style={{
                                padding: "0.5rem 0.75rem",
                                textAlign: "left",
                                fontWeight: 700,
                                borderBottom: "2px solid #cbd5e1",
                                color: "#1e293b",
                            }}
                        >
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td
                            style={{
                                padding: "0.45rem 0.75rem",
                                borderBottom: "1px solid #e2e8f0",
                            }}
                        >
                            {children}
                        </td>
                    ),
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: "var(--accent)",
                                fontWeight: 600,
                                textDecoration: "underline",
                                textUnderlineOffset: "3px",
                            }}
                        >
                            {children}
                        </a>
                    ),
                    strong: ({ children }) => (
                        <strong style={{ fontWeight: 700, color: "#0f172a" }}>
                            {children}
                        </strong>
                    ),
                    code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !match && !String(children).includes("\n");

                        if (isInline) {
                            return (
                                <code
                                    style={{
                                        background: "#f1f5f9",
                                        color: "#8b5cf6",
                                        padding: "0.15rem 0.35rem",
                                        borderRadius: "4px",
                                        fontSize: "0.82em",
                                        fontFamily: "monospace",
                                        fontWeight: 600,
                                        border: "1px solid #e2e8f0",
                                    }}
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }

                        const codeString = String(children).replace(/\n$/, "");
                        const language = match ? match[1] : "";

                        return <CodeBlock language={language} value={codeString} />;
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
