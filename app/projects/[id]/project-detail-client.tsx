"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useGetMessages, useCreateMessage } from "@/features/message/hooks/message";
import { MarkdownMessage } from "@/components/chat/markdown-message";
import { CodeEditorView } from "@/components/editor/code-editor-view";
import { Play, Code2, ExternalLink, RotateCcw, ArrowLeft, ArrowRight } from "lucide-react";

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
    const [iframeKey, setIframeKey] = useState(0);
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
        <div className="flex-1 p-2 bg-90s-tile flex flex-col md:flex-row gap-2 overflow-hidden h-[calc(100vh-4.2rem)]">
            {/* ── Left Window: AI Webmaster Console ──────────────── */}
            <div className="w-full md:w-[420px] lg:w-[460px] flex-shrink-0 win-window flex flex-col overflow-hidden">
                {/* Window Title Bar */}
                <div className="win-titlebar">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                        <Link
                            href="/projects"
                            className="win-btn-control text-black no-underline flex items-center justify-center font-bold"
                            title="Back to websites directory"
                        >
                            ←
                        </Link>
                        <span className="truncate font-mono">
                            💬 Webmaster_Assistant.exe - [{project.name}]
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span className="win-btn-control">_</span>
                        <span className="win-btn-control">□</span>
                        <Link href="/projects" className="win-btn-control text-black no-underline">✕</Link>
                    </div>
                </div>

                {/* Subheader Status */}
                <div className="px-3 py-1 bg-[#c0c0c0] border-b border-[#808080] flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-[#00ff00] border border-black inline-block" />
                        <span className="font-bold text-black">
                            {isProcessing ? "COMPILING CODE..." : "READY"}
                        </span>
                    </div>
                    <span className="text-[#808080]">
                        {allMessages.length} command{allMessages.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Messages History List */}
                <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2.5 bg-white bevel-inset m-1">
                    {messagesLoading && allMessages.length === 0 && (
                        <div className="p-4 text-center font-mono text-xs text-[#808080]">
                            <div className="text-2xl mb-1 animate-pulse">⏳</div>
                            <span>Loading conversation log...</span>
                        </div>
                    )}

                    {allMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col gap-1 ${
                                msg.role === "USER" ? "items-end" : "items-start"
                            }`}
                        >
                            <div className="text-[10px] font-mono text-[#808080] px-1">
                                {msg.role === "USER" ? "USER COMMAND" : "CRAFTLY ASSISTANT"}
                            </div>

                            <div
                                className={`w-full max-w-[95%] p-2.5 ${
                                    msg.role === "USER"
                                        ? "bevel-outset bg-[#c0c0c0] text-black"
                                        : msg.type === "ERROR"
                                        ? "bevel-inset bg-[#ffe6e6] text-[#cc0000]"
                                        : "bevel-inset bg-[#ffffcc] text-black"
                                }`}
                            >
                                <MarkdownMessage
                                    content={msg.content}
                                    isUser={msg.role === "USER"}
                                />
                            </div>

                            {/* Generated Fragment Badge */}
                            {msg.fragments?.title && (
                                <div className="bevel-outset px-2 py-0.5 bg-[#c0c0c0] text-[11px] font-mono font-bold text-[#000080] flex items-center gap-1">
                                    <span>✓</span>
                                    <span>{msg.fragments.title}</span>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Processing Animation */}
                    {isProcessing && (
                        <div className="bevel-inset p-3 bg-[#ffffcc] text-black">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="animate-spin text-sm">⏳</span>
                                <span className="font-mono text-xs font-bold text-[#000080]">
                                    Writing pure HTML, CSS & JavaScript...
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="badge-retro text-[10px]">index.html</span>
                                <span className="badge-retro text-[10px]">styles.css</span>
                                <span className="badge-retro text-[10px]">script.js</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Command Input Area */}
                <form onSubmit={handleSend} className="p-2 bg-[#c0c0c0] border-t border-[#808080]">
                    <div className="bevel-inset p-1.5 bg-white mb-2">
                        <textarea
                            id="chat-message-input"
                            ref={textareaRef}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type follow-up instructions (e.g. 'Add a dark mode toggle button', 'Make the paddle faster')..."
                            rows={2}
                            className="w-full border-none outline-none font-mono text-xs text-black bg-transparent resize-none leading-relaxed"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#808080]">
                            Press [Ctrl + Enter] to send
                        </span>

                        <button
                            id="send-message-btn"
                            type="submit"
                            disabled={!newMessage.trim() || createMessage.isPending}
                            className="btn-win95 btn-win95-primary text-xs py-1 px-3 font-bold flex items-center gap-1"
                        >
                            <span>⚡ SEND COMMAND</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* ── Right Window: Browser Sandbox Preview ──────────── */}
            <div className="flex-1 win-window flex flex-col overflow-hidden">
                {/* Title Bar */}
                <div className="win-titlebar bg-gradient-to-r from-[#000080] to-[#1084d0]">
                    <div className="flex items-center gap-2">
                        <span>🌐 Internet_Browser_95.exe - [Sandbox Preview]</span>
                    </div>
                    <div className="flex items-center">
                        <span className="win-btn-control">_</span>
                        <span className="win-btn-control">□</span>
                        <span className="win-btn-control">✕</span>
                    </div>
                </div>

                {/* Browser Toolbar & Address Bar */}
                <div className="p-1.5 bg-[#c0c0c0] border-b border-[#808080] flex flex-wrap items-center gap-2">
                    {/* View Switcher Tabs */}
                    <div className="flex items-center gap-1">
                        <button
                            id="tab-preview"
                            type="button"
                            onClick={() => setActiveTab("preview")}
                            className={`btn-win95 text-xs py-1 px-2.5 font-bold flex items-center gap-1.5 ${
                                activeTab === "preview" ? "btn-win95-primary" : ""
                            }`}
                        >
                            <Play size={12} />
                            <span>▶ PREVIEW</span>
                        </button>

                        <button
                            id="tab-code"
                            type="button"
                            onClick={() => setActiveTab("code")}
                            className={`btn-win95 text-xs py-1 px-2.5 font-bold flex items-center gap-1.5 ${
                                activeTab === "code" ? "btn-win95-primary" : ""
                            }`}
                        >
                            <Code2 size={13} />
                            <span>&lt;/&gt; SOURCE CODE</span>
                            {latestFragment?.files && Object.keys(latestFragment.files).length > 0 && (
                                <span className="bg-[#ffff00] text-black text-[10px] px-1 font-mono font-bold border border-black">
                                    {Object.keys(latestFragment.files).length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Browser Address Bar */}
                    <div className="flex-1 min-w-[200px] flex items-center gap-1">
                        <div className="bevel-inset flex-1 flex items-center gap-1.5 px-2 py-0.5 bg-white font-mono text-xs text-black">
                            <span className="text-[#808080] font-bold">URL:</span>
                            <span className="truncate">
                                {latestFragment?.sandboxUrl || "http://localhost:craftly/index.html"}
                            </span>
                        </div>

                        {latestFragment?.sandboxUrl && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setIframeKey((prev) => prev + 1)}
                                    title="Reload preview"
                                    className="btn-win95 text-xs py-1 px-1.5"
                                >
                                    <RotateCcw size={12} />
                                </button>

                                <a
                                    id="open-sandbox-external"
                                    href={latestFragment.sandboxUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Open website in new browser tab"
                                    className="btn-win95 text-xs py-1 px-1.5"
                                >
                                    <ExternalLink size={12} />
                                </a>
                            </>
                        )}
                    </div>
                </div>

                {/* Main Content Pane */}
                <div className="flex-1 bg-white overflow-hidden bevel-inset m-1">
                    {latestFragment ? (
                        activeTab === "preview" ? (
                            <iframe
                                key={iframeKey}
                                id="sandbox-preview"
                                src={latestFragment.sandboxUrl}
                                className="w-full h-full border-none bg-white"
                                title={latestFragment.title}
                                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                            />
                        ) : (
                            <CodeEditorView files={latestFragment.files || {}} />
                        )
                    ) : (
                        /* Empty / Waiting Sandbox State */
                        <div className="h-full flex flex-col items-center justify-center p-6 bg-[#c0c0c0] text-black">
                            {isProcessing ? (
                                <div className="win-window max-w-sm w-full p-6 text-center">
                                    <div className="text-3xl mb-2 animate-bounce">⏳</div>
                                    <h3 className="font-bold text-sm uppercase mb-1">
                                        Craftly AI is generating code...
                                    </h3>
                                    <p className="font-mono text-xs text-[#808080] mb-3">
                                        Writing clean HTML, CSS, and JS files into an isolated sandbox environment.
                                    </p>
                                    <div className="bevel-inset p-1 bg-white">
                                        <div className="h-4 bg-[#000080] animate-pulse" />
                                    </div>
                                </div>
                            ) : (
                                <div className="win-window max-w-sm w-full p-6 text-center">
                                    <div className="text-3xl mb-2">🌐</div>
                                    <h3 className="font-bold text-sm uppercase mb-1">
                                        Live Sandbox Preview
                                    </h3>
                                    <p className="font-mono text-xs text-[#808080]">
                                        Once the AI builds your website, the live interactive preview and source files will load right here.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
