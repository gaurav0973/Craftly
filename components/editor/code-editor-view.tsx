"use client";

import React, { useState, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
    FileCode,
    FileText,
    FileJson,
    Folder,
    FolderOpen,
    Copy,
    Check,
    Download,
    Search,
    ChevronRight,
    ChevronDown,
    X,
    File,
    Code,
    Sparkles,
} from "lucide-react";

interface CodeEditorViewProps {
    files: Record<string, string>;
}

// Map file extensions to language & icon color
function getFileMeta(fileName: string) {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    switch (ext) {
        case "tsx":
        case "jsx":
            return {
                language: "tsx",
                color: "#61dafb",
                icon: FileCode,
                label: "React",
            };
        case "ts":
            return {
                language: "typescript",
                color: "#3178c6",
                icon: FileCode,
                label: "TypeScript",
            };
        case "js":
        case "mjs":
            return {
                language: "javascript",
                color: "#f7df1e",
                icon: FileCode,
                label: "JavaScript",
            };
        case "css":
            return {
                language: "css",
                color: "#38bdf8",
                icon: FileCode,
                label: "CSS",
            };
        case "html":
            return {
                language: "html",
                color: "#e34f26",
                icon: Code,
                label: "HTML",
            };
        case "json":
            return {
                language: "json",
                color: "#fbbf24",
                icon: FileJson,
                label: "JSON",
            };
        case "md":
            return {
                language: "markdown",
                color: "#a78bfa",
                icon: FileText,
                label: "Markdown",
            };
        default:
            return {
                language: "text",
                color: "#94a3b8",
                icon: File,
                label: ext.toUpperCase() || "File",
            };
    }
}

export function CodeEditorView({ files }: CodeEditorViewProps) {
    const filePaths = useMemo(() => Object.keys(files || {}).sort(), [files]);
    const [selectedPath, setSelectedPath] = useState<string>(
        filePaths[0] || "",
    );
    const [openTabs, setOpenTabs] = useState<string[]>(
        filePaths.slice(0, 4),
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [copied, setCopied] = useState(false);

    // Keep selectedPath valid if files change
    React.useEffect(() => {
        if (filePaths.length > 0 && !files[selectedPath]) {
            setSelectedPath(filePaths[0]);
            setOpenTabs(filePaths.slice(0, 4));
        }
    }, [filePaths, files, selectedPath]);

    const filteredFiles = useMemo(() => {
        if (!searchQuery.trim()) return filePaths;
        return filePaths.filter((path) =>
            path.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [filePaths, searchQuery]);

    const activeContent = files[selectedPath] || "";
    const activeMeta = getFileMeta(selectedPath);

    const handleSelectFile = (path: string) => {
        setSelectedPath(path);
        if (!openTabs.includes(path)) {
            setOpenTabs([...openTabs, path]);
        }
    };

    const handleCloseTab = (e: React.MouseEvent, path: string) => {
        e.stopPropagation();
        const nextTabs = openTabs.filter((t) => t !== path);
        setOpenTabs(nextTabs);
        if (selectedPath === path) {
            if (nextTabs.length > 0) {
                setSelectedPath(nextTabs[nextTabs.length - 1]);
            } else if (filePaths.length > 0) {
                setSelectedPath(filePaths[0]);
            }
        }
    };

    const handleCopy = async () => {
        if (!activeContent) return;
        try {
            await navigator.clipboard.writeText(activeContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    const handleDownload = () => {
        if (!activeContent) return;
        const blob = new Blob([activeContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = selectedPath.split("/").pop() || "file.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const lineCount = activeContent ? activeContent.split("\n").length : 0;
    const charCount = activeContent.length;

    if (filePaths.length === 0) {
        return (
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94a3b8",
                    gap: "0.75rem",
                    background: "#18181b",
                }}
            >
                <Code size={40} color="#475569" />
                <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600 }}>
                    No source files generated yet
                </p>
            </div>
        );
    }

    return (
        <div
            style={{
                height: "100%",
                display: "flex",
                background: "#18181b",
                color: "#e2e8f0",
                overflow: "hidden",
                fontFamily: "system-ui, -apple-system, sans-serif",
            }}
        >
            {/* ── Left: File Explorer ──────────────────────────── */}
            <div
                style={{
                    width: "240px",
                    minWidth: "200px",
                    maxWidth: "280px",
                    background: "#141416",
                    borderRight: "1px solid #27272a",
                    display: "flex",
                    flexDirection: "column",
                    userSelect: "none",
                }}
            >
                {/* Explorer Header */}
                <div
                    style={{
                        padding: "0.75rem 0.9rem",
                        borderBottom: "1px solid #27272a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <FolderOpen size={15} color="#8b5cf6" />
                        <span
                            style={{
                                fontSize: "0.72rem",
                                fontWeight: 800,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                color: "#cbd5e1",
                            }}
                        >
                            Explorer ({filePaths.length})
                        </span>
                    </div>
                </div>

                {/* Search in Files */}
                <div style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid #27272a" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            background: "#27272a",
                            padding: "0.3rem 0.5rem",
                            borderRadius: "6px",
                            border: "1px solid #3f3f46",
                        }}
                    >
                        <Search size={13} color="#94a3b8" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter files..."
                            style={{
                                background: "transparent",
                                border: "none",
                                outline: "none",
                                color: "white",
                                fontSize: "0.75rem",
                                width: "100%",
                            }}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "#94a3b8",
                                    cursor: "pointer",
                                    padding: 0,
                                }}
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>
                </div>

                {/* File List */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "0.4rem 0.35rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                    }}
                >
                    {filteredFiles.map((path) => {
                        const isSelected = path === selectedPath;
                        const meta = getFileMeta(path);
                        const Icon = meta.icon;
                        const fileName = path.split("/").pop() || path;
                        const dirPath = path.includes("/")
                            ? path.substring(0, path.lastIndexOf("/"))
                            : "";

                        return (
                            <button
                                key={path}
                                onClick={() => handleSelectFile(path)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    padding: "0.4rem 0.6rem",
                                    borderRadius: "6px",
                                    background: isSelected ? "#27272a" : "transparent",
                                    color: isSelected ? "white" : "#a1a1aa",
                                    border: "none",
                                    textAlign: "left",
                                    cursor: "pointer",
                                    transition: "all 0.15s ease",
                                    fontSize: "0.8rem",
                                    width: "100%",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.background = "#1f1f23";
                                        e.currentTarget.style.color = "#e4e4e7";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.background = "transparent";
                                        e.currentTarget.style.color = "#a1a1aa";
                                    }
                                }}
                            >
                                <Icon size={14} color={meta.color} style={{ flexShrink: 0 }} />
                                <div style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    <span style={{ fontWeight: isSelected ? 600 : 400 }}>
                                        {fileName}
                                    </span>
                                    {dirPath && (
                                        <span style={{ fontSize: "0.68rem", color: "#71717a", marginLeft: "0.35rem" }}>
                                            {dirPath}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}

                    {filteredFiles.length === 0 && (
                        <p style={{ fontSize: "0.75rem", color: "#71717a", textAlign: "center", padding: "1rem" }}>
                            No files match "{searchQuery}"
                        </p>
                    )}
                </div>
            </div>

            {/* ── Right: Editor Area ───────────────────────────── */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    background: "#1e1e1e",
                }}
            >
                {/* Tab Bar */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "#141416",
                        borderBottom: "1px solid #27272a",
                        overflowX: "auto",
                        minHeight: "36px",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", overflowX: "auto" }}>
                        {openTabs.map((path) => {
                            const isSelected = path === selectedPath;
                            const meta = getFileMeta(path);
                            const Icon = meta.icon;
                            const fileName = path.split("/").pop() || path;

                            return (
                                <div
                                    key={path}
                                    onClick={() => setSelectedPath(path)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.45rem",
                                        padding: "0.45rem 0.85rem",
                                        background: isSelected ? "#1e1e1e" : "#18181b",
                                        color: isSelected ? "white" : "#a1a1aa",
                                        borderRight: "1px solid #27272a",
                                        borderTop: isSelected ? "2px solid var(--accent)" : "2px solid transparent",
                                        fontSize: "0.78rem",
                                        fontWeight: isSelected ? 600 : 400,
                                        cursor: "pointer",
                                        userSelect: "none",
                                        whiteSpace: "nowrap",
                                        transition: "background 0.15s ease",
                                    }}
                                >
                                    <Icon size={13} color={meta.color} />
                                    <span>{fileName}</span>
                                    <button
                                        onClick={(e) => handleCloseTab(e, path)}
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            color: "#71717a",
                                            cursor: "pointer",
                                            padding: "2px",
                                            display: "flex",
                                            alignItems: "center",
                                            borderRadius: "3px",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = "#71717a")}
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Actions on active file */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0 0.6rem" }}>
                        <button
                            type="button"
                            onClick={handleCopy}
                            title="Copy file contents"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                padding: "0.25rem 0.55rem",
                                background: copied ? "#059669" : "#27272a",
                                color: "white",
                                border: "1px solid #3f3f46",
                                borderRadius: "6px",
                                fontSize: "0.72rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                            }}
                        >
                            {copied ? <Check size={12} /> : <Copy size={12} />}
                            <span>{copied ? "Copied" : "Copy"}</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleDownload}
                            title="Download file"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                padding: "0.25rem 0.55rem",
                                background: "#27272a",
                                color: "white",
                                border: "1px solid #3f3f46",
                                borderRadius: "6px",
                                fontSize: "0.72rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                            }}
                        >
                            <Download size={12} />
                        </button>
                    </div>
                </div>

                {/* Path Breadcrumb Bar */}
                <div
                    style={{
                        padding: "0.3rem 0.9rem",
                        background: "#18181b",
                        borderBottom: "1px solid #27272a",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        fontSize: "0.72rem",
                        color: "#71717a",
                        fontFamily: "monospace",
                    }}
                >
                    <span style={{ color: "#a1a1aa" }}>craftly</span>
                    {selectedPath.split("/").map((segment, i, arr) => (
                        <React.Fragment key={i}>
                            <ChevronRight size={11} color="#52525b" />
                            <span style={{ color: i === arr.length - 1 ? "#e4e4e7" : "#a1a1aa", fontWeight: i === arr.length - 1 ? 600 : 400 }}>
                                {segment}
                            </span>
                        </React.Fragment>
                    ))}
                </div>

                {/* Code Viewer */}
                <div
                    style={{
                        flex: 1,
                        overflow: "auto",
                        background: "#1e1e1e",
                        position: "relative",
                    }}
                >
                    <SyntaxHighlighter
                        language={activeMeta.language}
                        style={vscDarkPlus}
                        customStyle={{
                            margin: 0,
                            padding: "1rem",
                            background: "#1e1e1e",
                            fontFamily: "JetBrains Mono, Fira Code, Menlo, monospace",
                            fontSize: "0.85rem",
                            lineHeight: 1.6,
                            minHeight: "100%",
                        }}
                        showLineNumbers={true}
                        lineNumberStyle={{
                            minWidth: "2.8em",
                            paddingRight: "1em",
                            color: "#52525b",
                            fontSize: "0.78rem",
                            userSelect: "none",
                        }}
                    >
                        {activeContent}
                    </SyntaxHighlighter>
                </div>

                {/* Status Bar */}
                <div
                    style={{
                        padding: "0.25rem 0.9rem",
                        background: "#09090b",
                        borderTop: "1px solid #27272a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: "0.68rem",
                        color: "#71717a",
                        fontFamily: "monospace",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                        <span>Lines: <strong style={{ color: "#d4d4d8" }}>{lineCount}</strong></span>
                        <span>Chars: <strong style={{ color: "#d4d4d8" }}>{charCount}</strong></span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                        <span>UTF-8</span>
                        <span>Spaces: 2</span>
                        <span style={{ color: activeMeta.color, fontWeight: 600 }}>{activeMeta.label}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
