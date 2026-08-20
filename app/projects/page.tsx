"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateProject, useDeleteProject, useGetProjects } from "@/features/projects/hooks/project";

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
        label: "2D Arcade Game",
        prompt: "Build an arcade 2D Snake & Pong game hub using pure HTML5 Canvas and Vanilla JavaScript. Include a game switcher to toggle between Snake and Pong, smooth 60fps canvas animation loops, keyboard controls (Arrow keys / WASD), difficulty selection (Easy/Hard), real-time score tracking, local high score leaderboard saved in localStorage, retro pixel font styling, and authentic 8-bit sound effects using Web Audio API.",
    },
    {
        icon: "📊",
        label: "Admin Dashboard",
        prompt: "Build a complete multi-page Windows 95 Executive Admin Dashboard web app using pure HTML, CSS, and JS. Include a landing overview page (index.html) with KPI stat panels (Visitors, Revenue, Server Health), interactive Chart.js canvas line and bar charts with retro palettes, a filterable data table with search and CSV export, a sub-page for User Management (/pages/users/) with modal dialogs to add/edit users, and a sub-page for System Settings (/pages/settings/), all linked via a persistent top navigation bar.",
    },
    {
        icon: "🛍️",
        label: "E-Commerce Store",
        prompt: "Create a multi-page 90s Cyber Electronics E-Commerce store using pure HTML, CSS, and Vanilla JavaScript. Include a home catalog page (index.html) with vintage gadget products (Floppy Disks, CRT Monitors, Dial-up Modems), category filters, live keyword search, price sorting, and star ratings. Add a slide-out Shopping Cart with quantity controls and promo code discounts, a dedicated Contact & Order Inquiry sub-page (/pages/contact/) with form validation, and an About Our Web Shop sub-page (/pages/about/) with customer reviews and FAQ accordions.",
    },
    {
        icon: "📋",
        label: "Task & Note Manager",
        prompt: "Build an interactive productivity suite styled like Windows 95 Notepad & Task Manager using pure HTML, CSS, and Vanilla JavaScript. Features include: adding/editing/deleting categorized tasks with priority badges (High, Medium, Low), drag-and-drop task reordering, due date countdowns, search and filter tabs (All, Active, Completed), a built-in rich scratchpad note-taker with auto-saving to localStorage, and import/export task data as JSON.",
    },
    {
        icon: "🎨",
        label: "GeoCities Portfolio",
        prompt: "Create an authentic 1990s GeoCities-style personal webmaster portfolio. Build a multi-page retro website with an index.html home hub featuring a Windows 95 desktop layout, animated marquee ticker, rotating 3D 'Under Construction' badges, a live visitor hit counter, an interactive retro MP3/MIDI web audio player with play/pause, a Projects sub-page (/pages/projects/) with 3D beveled cards and modal previews, and a working Interactive Guestbook sub-page (/pages/guestbook/) where visitors can leave comments stored in localStorage.",
    },
    {
        icon: "🧮",
        label: "Retro Calculator",
        prompt: "Build a multifunctional retro Windows 95 Scientific Calculator & Unit Converter web app using pure HTML, CSS, and Vanilla JS. Features include a full grid of 3D beveled buttons with keyboard input support, standard math operations, memory store/recall (M+, M-, MR, MC), scientific functions (sin, cos, tan, sqrt, pow, log), a scrolling calculation history tape saved in localStorage with a copy button, and a toggleable Unit Converter panel for temperature, length, and currency conversions with live calculations.",
    },
];

export default function ProjectsPage() {
    const router = useRouter();
    const [prompt, setPrompt] = useState("");
    const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);
    const { data: projects, isLoading: projectsLoading } = useGetProjects();
    const createProject = useCreateProject();
    const deleteProject = useDeleteProject();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || createProject.isPending) return;

        const result = await createProject.mutateAsync(prompt.trim());
        if (result && "id" in result) {
            setPrompt("");
            router.push(`/projects/${result.id}`);
        }
    };

    const handleDelete = async () => {
        if (!projectToDelete || deleteProject.isPending) return;
        try {
            await deleteProject.mutateAsync(projectToDelete.id);
            setProjectToDelete(null);
        } catch (error) {
            console.error("Failed to delete project:", error);
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
            {/* ── Delete Confirmation Dialog (Windows 95 Modal) ────── */}
            {projectToDelete && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="win-window max-w-md w-full shadow-2xl">
                        <div className="win-titlebar bg-gradient-to-r from-[#800000] to-[#cc0000]">
                            <div className="flex items-center gap-1.5">
                                <span>⚠️</span>
                                <span>Confirm File Deletion</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setProjectToDelete(null)}
                                className="win-btn-control text-black"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-4 bg-[#c0c0c0]">
                            <div className="flex items-start gap-3 mb-4">
                                <span className="text-3xl">🗑️</span>
                                <div>
                                    <h3 className="font-bold text-sm text-black mb-1">
                                        Delete Website Project?
                                    </h3>
                                    <p className="text-xs font-mono text-black leading-relaxed">
                                        Are you sure you want to permanently delete <strong className="text-[#000080]">&quot;{projectToDelete.name}&quot;</strong>? This will remove all generated HTML, CSS, and JS files.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#808080]">
                                <button
                                    type="button"
                                    onClick={() => setProjectToDelete(null)}
                                    disabled={deleteProject.isPending}
                                    className="btn-win95 text-xs py-1.5 px-4 font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleteProject.isPending}
                                    className="btn-win95 text-xs py-1.5 px-4 font-bold bg-[#ff0000] text-white hover:bg-[#cc0000]"
                                >
                                    {deleteProject.isPending ? "Deleting..." : "Delete Project"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                🕹️ Try &quot;2D Arcade Game&quot; Preset
                            </button>
                        </div>
                    )}

                    {/* Project Table Grid */}
                    {!projectsLoading && projects && !("error" in projects) && Array.isArray(projects) && projects.length > 0 && (
                        <div className="overflow-x-auto bevel-inset">
                            <table className="table-retro">
                                <thead>
                                    <tr>
                                        <th style={{ width: "38%" }}>Website Project</th>
                                        <th style={{ width: "24%" }}>Date Created</th>
                                        <th style={{ width: "14%" }}>Type</th>
                                        <th style={{ width: "24%", textAlign: "center" }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((project) => (
                                        <tr key={project.id}>
                                            <td className="font-bold">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base">📄</span>
                                                    <span className="truncate max-w-[260px]" title={project.name}>
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
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <a
                                                        href={`/projects/${project.id}`}
                                                        id={`open-project-${project.id}`}
                                                        className="btn-win95 btn-win95-primary text-[11px] py-0.5 px-2 font-bold inline-flex items-center gap-1"
                                                    >
                                                        <span>Open</span>
                                                        <span>→</span>
                                                    </a>
                                                    <button
                                                        type="button"
                                                        id={`delete-project-${project.id}`}
                                                        onClick={() => setProjectToDelete({ id: project.id, name: project.name })}
                                                        className="btn-win95 text-[11px] py-0.5 px-1.5 font-bold text-[#cc0000] hover:bg-[#ff0000] hover:text-white"
                                                        title={`Delete ${project.name}`}
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
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

