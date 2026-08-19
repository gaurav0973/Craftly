"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy, Terminal, FileCode } from "lucide-react";

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
        <div className="win-window my-2 bg-[#c0c0c0]">
            {/* Windows Title Bar for Code Snippet */}
            <div className="win-titlebar bg-gradient-to-r from-[#000080] to-[#1084d0] py-0.5 px-2">
                <div className="flex items-center gap-1.5 text-xs">
                    {displayLanguage === "bash" || displayLanguage === "sh" ? (
                        <Terminal size={12} color="#00ff00" />
                    ) : (
                        <FileCode size={12} color="#ffff00" />
                    )}
                    <span className="font-mono text-[11px] font-bold text-white uppercase">
                        {displayLanguage}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleCopy}
                    className="btn-win95 text-[10px] py-0.5 px-1.5 flex items-center gap-1 bg-[#c0c0c0] text-black"
                >
                    {copied ? (
                        <>
                            <Check size={10} color="#00aa00" />
                            <span>COPIED!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={10} />
                            <span>COPY</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code Content */}
            <div className="bevel-inset bg-[#1e1e1e] font-mono text-xs overflow-x-auto">
                <SyntaxHighlighter
                    language={displayLanguage}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: "0.75rem",
                        background: "#1e1e1e",
                        fontFamily: "Courier New, monospace",
                        fontSize: "0.8rem",
                        lineHeight: 1.5,
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
            <div className="font-mono text-xs whitespace-pre-wrap break-words leading-relaxed text-black">
                {content}
            </div>
        );
    }

    return (
        <div className="text-xs leading-relaxed text-black break-words font-sans">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ children }) => (
                        <h1 className="text-base font-black uppercase text-black mt-2 mb-1 border-b border-[#808080] pb-1">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-sm font-black uppercase text-black mt-2 mb-1">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-xs font-bold uppercase text-black mt-1.5 mb-0.5">
                            {children}
                        </h3>
                    ),
                    p: ({ children }) => (
                        <p className="my-1 text-black">{children}</p>
                    ),
                    ul: ({ children }) => (
                        <ul className="pl-4 my-1 list-disc text-black">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="pl-4 my-1 list-decimal text-black">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="my-0.5 text-black">{children}</li>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote className="panel-notepad my-2 text-black border-l-4 border-[#000080]">
                            {children}
                        </blockquote>
                    ),
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-2 bevel-inset">
                            <table className="table-retro">{children}</table>
                        </div>
                    ),
                    thead: ({ children }) => <thead>{children}</thead>,
                    th: ({ children }) => <th>{children}</th>,
                    td: ({ children }) => <td>{children}</td>,
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0000ff] underline hover:text-[#ff0000] font-bold"
                        >
                            {children}
                        </a>
                    ),
                    strong: ({ children }) => (
                        <strong className="font-bold text-black">{children}</strong>
                    ),
                    code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !match && !String(children).includes("\n");

                        if (isInline) {
                            return (
                                <code
                                    className="bg-white text-[#000080] px-1 py-0.5 border border-[#808080] font-mono text-[11px] font-bold"
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
