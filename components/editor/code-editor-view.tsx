"use client";

import React, { useState, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
    FileCode,
    FileText,
    FileJson,
    FolderOpen,
    Copy,
    Check,
    Download,
    Search,
    ChevronRight,
    X,
    File,
    Code,
} from "lucide-react";

interface CodeEditorViewProps {
    files: Record<string, string>;
}

// Map file extensions to language & icon color
function getFileMeta(fileName: string) {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    switch (ext) {
        case "html":
        case "htm":
            return {
                language: "html",
                color: "#e34f26",
                icon: Code,
                label: "HTML",
                tag: "[HTML]",
            };
        case "css":
            return {
                language: "css",
                color: "#0000ff",
                icon: FileCode,
                label: "CSS",
                tag: "[CSS]",
            };
        case "js":
        case "mjs":
            return {
                language: "javascript",
                color: "#b8860b",
                icon: FileCode,
                label: "JavaScript",
                tag: "[JS]",
            };
        case "json":
            return {
                language: "json",
                color: "#008000",
                icon: FileJson,
                label: "JSON",
                tag: "[JSON]",
            };
        case "md":
            return {
                language: "markdown",
                color: "#800080",
                icon: FileText,
                label: "Markdown",
                tag: "[MD]",
            };
        default:
            return {
                language: "text",
                color: "#000000",
                icon: File,
                label: ext.toUpperCase() || "File",
                tag: `[${ext.toUpperCase() || "FILE"}]`,
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
            <div className="h-full flex flex-col items-center justify-center p-6 bg-[#c0c0c0] text-black">
                <div className="win-window max-w-sm w-full p-4 text-center">
                    <div className="text-2xl mb-2">📄</div>
                    <h3 className="font-bold text-sm uppercase mb-1">No source files generated</h3>
                    <p className="font-mono text-xs text-[#808080]">
                        Ask the AI to build your website to generate index.html, style.css, and script.js files.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col md:flex-row bg-[#c0c0c0] text-black overflow-hidden font-sans border-2 border-t-0 border-[#808080]">
            {/* ── Left: Retro File Explorer ─────────────────────── */}
            <div className="w-full md:w-56 flex-shrink-0 bg-[#c0c0c0] border-b md:border-b-0 md:border-r-2 border-[#808080] flex flex-col">
                {/* Explorer Header */}
                <div className="win-titlebar bg-gradient-to-r from-[#000080] to-[#1084d0] py-1 px-2">
                    <div className="flex items-center gap-1.5 text-xs">
                        <FolderOpen size={13} color="#ffff00" />
                        <span className="font-bold uppercase tracking-wider text-white text-[11px]">
                            Files ({filePaths.length})
                        </span>
                    </div>
                </div>

                {/* Filter Search Input */}
                <div className="p-2 border-b border-[#808080]">
                    <div className="bevel-inset flex items-center gap-1 px-1.5 py-0.5 bg-white">
                        <Search size={11} color="#808080" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter (*.html, *.css)..."
                            className="w-full border-none outline-none font-mono text-[11px] text-black bg-transparent"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="text-[#808080] hover:text-black"
                            >
                                <X size={11} />
                            </button>
                        )}
                    </div>
                </div>

                {/* File List */}
                <div className="flex-1 overflow-y-auto p-1.5 flex flex-col gap-1 bg-white bevel-inset m-1">
                    {filteredFiles.map((path) => {
                        const isSelected = path === selectedPath;
                        const meta = getFileMeta(path);
                        const fileName = path.split("/").pop() || path;

                        return (
                            <button
                                key={path}
                                onClick={() => handleSelectFile(path)}
                                className={`flex items-center gap-1.5 px-2 py-1 text-left text-xs font-mono w-full cursor-pointer transition-none border ${
                                    isSelected
                                        ? "bg-[#000080] text-white border-black"
                                        : "bg-transparent text-black border-transparent hover:bg-[#e8e8e8]"
                                }`}
                            >
                                <span className={`font-black text-[10px] ${isSelected ? "text-[#ffff00]" : "text-[#000080]"}`}>
                                    {meta.tag}
                                </span>
                                <span className="truncate flex-1 font-bold">
                                    {fileName}
                                </span>
                            </button>
                        );
                    })}

                    {filteredFiles.length === 0 && (
                        <p className="text-[11px] font-mono text-[#808080] text-center p-3">
                            No files match &quot;{searchQuery}&quot;
                        </p>
                    )}
                </div>
            </div>

            {/* ── Right: Retro Code Editor Area ─────────────────── */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#c0c0c0]">
                {/* 90s Tab Bar */}
                <div className="flex items-center justify-between bg-[#c0c0c0] border-b-2 border-[#808080] px-1 pt-1 overflow-x-auto min-h-[32px]">
                    <div className="flex items-center gap-1 overflow-x-auto">
                        {openTabs.map((path) => {
                            const isSelected = path === selectedPath;
                            const meta = getFileMeta(path);
                            const fileName = path.split("/").pop() || path;

                            return (
                                <div
                                    key={path}
                                    onClick={() => setSelectedPath(path)}
                                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono cursor-pointer user-select-none whitespace-nowrap border-2 ${
                                        isSelected
                                            ? "bg-[#ffffff] text-black border-b-0 border-[#808080] -mb-[2px] font-bold z-10"
                                            : "bg-[#c0c0c0] text-[#404040] border-[#ffffff_#808080_#808080_#ffffff]"
                                    }`}
                                >
                                    <span className="font-bold text-[10px] text-[#000080]">
                                        {meta.tag}
                                    </span>
                                    <span>{fileName}</span>
                                    <button
                                        onClick={(e) => handleCloseTab(e, path)}
                                        className="hover:bg-[#ff0000] hover:text-white p-0.5 ml-1 text-xs leading-none"
                                        title="Close tab"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Actions on Active File */}
                    <div className="flex items-center gap-1.5 pb-1 px-1 flex-shrink-0">
                        <button
                            type="button"
                            onClick={handleCopy}
                            title="Copy file code to clipboard"
                            className="btn-win95 text-[11px] py-0.5 px-2 flex items-center gap-1"
                        >
                            {copied ? <Check size={11} color="#00aa00" /> : <Copy size={11} />}
                            <span>{copied ? "COPIED" : "COPY"}</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleDownload}
                            title="Download file"
                            className="btn-win95 text-[11px] py-0.5 px-2 flex items-center gap-1"
                        >
                            <Download size={11} />
                            <span>DOWNLOAD</span>
                        </button>
                    </div>
                </div>

                {/* Path Breadcrumb Bar */}
                <div className="px-2 py-0.5 bg-[#e8e8e8] border-b border-[#808080] flex items-center gap-1 text-[11px] font-mono text-black">
                    <span className="text-[#808080]">C:\craftly_project\</span>
                    {selectedPath.split("/").map((segment, i, arr) => (
                        <React.Fragment key={i}>
                            <ChevronRight size={10} color="#808080" />
                            <span className={i === arr.length - 1 ? "font-bold text-[#000080]" : "text-black"}>
                                {segment}
                            </span>
                        </React.Fragment>
                    ))}
                </div>

                {/* Code Content */}
                <div className="flex-1 overflow-auto bg-[#1e1e1e] bevel-inset m-1">
                    <SyntaxHighlighter
                        language={activeMeta.language}
                        style={vscDarkPlus}
                        customStyle={{
                            margin: 0,
                            padding: "0.75rem",
                            background: "#1e1e1e",
                            fontFamily: "Courier New, monospace",
                            fontSize: "0.82rem",
                            lineHeight: 1.5,
                            minHeight: "100%",
                        }}
                        showLineNumbers={true}
                        lineNumberStyle={{
                            minWidth: "2.5em",
                            paddingRight: "0.8em",
                            color: "#52525b",
                            fontSize: "0.78rem",
                            userSelect: "none",
                        }}
                    >
                        {activeContent}
                    </SyntaxHighlighter>
                </div>

                {/* Windows 95 Status Bar */}
                <div className="px-2 py-0.5 bg-[#c0c0c0] border-t border-[#808080] flex items-center justify-between text-[11px] font-mono text-black">
                    <div className="flex items-center gap-3">
                        <span className="bevel-inset px-1.5 py-0.2 bg-[#c0c0c0]">
                            Lines: <strong>{lineCount}</strong>
                        </span>
                        <span className="bevel-inset px-1.5 py-0.2 bg-[#c0c0c0]">
                            Chars: <strong>{charCount}</strong>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="bevel-inset px-1.5 py-0.2 bg-[#c0c0c0]">UTF-8</span>
                        <span className="bevel-inset px-1.5 py-0.2 bg-[#c0c0c0] text-[#000080] font-bold">
                            {activeMeta.label}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
