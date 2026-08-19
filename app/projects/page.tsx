"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateProject, useGetProjects } from "@/features/projects/hooks/project";

function formatDate(date: string | Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
}

const PRESET_IDEAS = [
    {
        icon: "🕹️",
        label: "2D Canvas Game",
        prompt: "Build an arcade 2D Snake or Pong game with HTML5 canvas, keyboard controls, high score tracking in localStorage, and retro pixel art styling.",
    },
    {
        icon: "📋",
        label: "Interactive Todo App",
        prompt: "Create a modern Todo and Task Manager web app using pure HTML, CSS, and JS with drag-and-drop, category filters, dark mode toggle, and localStorage.",
    },
    {
        icon: "🛍️",
        label: "E-Commerce Catalog",
        prompt: "Build a responsive product store catalog with search, price filtering, product detail modals, and an interactive shopping cart with local checkout.",
    },
    {
        icon: "🎨",
        label: "GeoCities Portfolio",
        prompt: "Create an authentic 90s personal webmaster portfolio with beveled windows, animated marquee ticker, hit counter, sound effects, and guestbook form.",
    },
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
        <div className="flex-1 max-w-5xl w-full mx-auto px-3 py-4 flex flex-col gap-6">
            {/* ── Prompt Console Window ────────────────────────────── */}
            <section className="win-window">
                {/* Title bar */}
                <div className="win-titlebar">
                    <div className="flex items-center gap-2">
                        <span>⌨️ C:\PROGRAMS\CRAFTLY\NEW_PROJECT_WIZARD.EXE - [Craftly 95]</span>
                        <span className="badge-new">PURE HTML/CSS/JS</span>
                    </div>
                    <div className="flex items-center">
                        <span className="win-btn-control">_</span>
                        <span className="win-btn-control">□</span>
                        <span className="win-btn-control">✕</span>
                    </div>
                </div>

                <div className="p-4 bg-[#c0c0c0]">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black uppercase text-black">
                                Craftly 95: Make AI Mediocre Again
                            </h1>
                            <p className="text-xs font-mono text-[#000080] font-bold">
                                Craftly is an AI website builder that generates pure HTML/CSS/JavaScript.
                            </p>
                        </div>
                        <span className="badge-hot hidden sm:inline-flex">⚡ ZERO FRAMEWORKS</span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="bevel-inset p-2 bg-white mb-3">
                            <textarea
                                id="project-prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g. Build an authentic retro 90s personal website with a hit counter, marquee announcements, beveled cards, and a working contact guestbook..."
                                rows={4}
                                className="w-full border-none outline-none font-mono text-sm text-black bg-transparent resize-none leading-relaxed p-1"
                            />
                            <div className="flex items-center justify-between pt-2 border-t border-[#808080] text-xs font-mono text-[#808080]">
                                <span>Tip: Press [Ctrl + Enter] or [⌘ + Enter] to compile</span>
                                <span className="font-bold text-black">{prompt.length} chars</span>
                            </div>
                        </div>

                        {/* Presets & Actions */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            {/* Preset Buttons */}
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[11px] font-mono text-black font-bold mr-1">PRESETS:</span>
                                {PRESET_IDEAS.map((preset, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setPrompt(preset.prompt)}
                                        className="btn-win95 text-[11px] py-1 px-2 font-mono flex items-center gap-1"
                                    >
                                        <span>{preset.icon}</span>
                                        <span>{preset.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Submit Button */}
                            <button
                                id="create-project-btn"
                                type="submit"
                                disabled={!prompt.trim() || createProject.isPending}
                                className="btn-win95 btn-win95-primary text-xs sm:text-sm py-2 px-5 font-bold flex items-center justify-center gap-2"
                            >
                                {createProject.isPending ? (
                                    <>
                                        <span className="animate-pulse">⏳</span>
                                        <span>GENERATING HTML/CSS/JS...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>⚡ CRAFT WEBSITE NOW</span>
                                        <span>→</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* ── Projects Directory (File Explorer Table) ──────────── */}
            <section className="win-window">
                <div className="win-titlebar">
                    <div className="flex items-center gap-2">
                        <span>📁 C:\MY_WEBSITES\</span>
                        {projects && !("error" in projects) && Array.isArray(projects) && (
                            <span className="badge-retro font-mono text-[10px]">
                                {projects.length} FILE{projects.length === 1 ? "" : "S"} FOUND
                            </span>
                        )}
                    </div>
                    <div className="flex items-center">
                        <span className="win-btn-control">_</span>
                        <span className="win-btn-control">□</span>
                        <span className="win-btn-control">✕</span>
                    </div>
                </div>

                <div className="p-4 bg-[#c0c0c0]">
                    {/* Header Info */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-mono text-black">
                            <span>Directory Listing of Generated Pure HTML/CSS/JS Websites</span>
                        </div>
                        <span className="text-xs font-mono text-[#808080]">File Type: Pure HTML/CSS/JS Web App</span>
                    </div>

                    {/* Loading State */}
                    {projectsLoading && (
                        <div className="bevel-inset p-8 bg-white text-center">
                            <div className="text-2xl mb-2 animate-bounce">⏳</div>
                            <p className="font-mono text-xs text-black font-bold">Scanning C:\MY_WEBSITES\ directory...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!projectsLoading && (!projects || ("error" in projects) || (Array.isArray(projects) && projects.length === 0)) && (
                        <div className="bevel-inset p-8 bg-white text-center">
                            <div className="text-3xl mb-2">📁</div>
                            <h3 className="font-bold text-sm text-black mb-1 uppercase">Directory is empty (0 files)</h3>
                            <p className="text-xs font-mono text-[#808080] max-w-sm mx-auto mb-4">
                                Craftly is an AI website builder that generates pure HTML/CSS/JavaScript. Enter a prompt in the console wizard above to build your first website.
                            </p>
                            <button
                                type="button"
                                onClick={() => setPrompt(PRESET_IDEAS[0].prompt)}
                                className="btn-win95 text-xs py-1 px-3 font-bold"
                            >
                                🕹️ Try &quot;2D Canvas Game&quot; Preset
                            </button>
                        </div>
                    )}

                    {/* Project Table Grid */}
                    {!projectsLoading && projects && !("error" in projects) && Array.isArray(projects) && projects.length > 0 && (
                        <div className="overflow-x-auto bevel-inset">
                            <table className="table-retro">
                                <thead>
                                    <tr>
                                        <th style={{ width: "40%" }}>Website Project</th>
                                        <th style={{ width: "25%" }}>Date Created</th>
                                        <th style={{ width: "15%" }}>Type</th>
                                        <th style={{ width: "20%", textAlign: "center" }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((project) => (
                                        <tr key={project.id}>
                                            <td className="font-bold">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base">📄</span>
                                                    <span className="truncate max-w-[280px]" title={project.name}>
                                                        {project.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="font-mono text-xs text-[#000000]">
                                                {formatDate(project.createdAt)}
                                            </td>
                                            <td>
                                                <span className="text-[10px] font-mono bg-[#000080] text-white px-1.5 py-0.5 border border-black font-bold">
                                                    HTML/CSS/JS
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <a
                                                    href={`/projects/${project.id}`}
                                                    id={`open-project-${project.id}`}
                                                    className="btn-win95 btn-win95-primary text-[11px] py-0.5 px-2 font-bold inline-flex items-center gap-1"
                                                >
                                                    <span>Open Studio</span>
                                                    <span>→</span>
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
