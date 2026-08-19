import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { onBoardUserToDatabase } from "@/features/auth/action";

export default async function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Protect: redirect unauthenticated users to sign-in
    const { userId } = await auth();
    if (!userId) {
        redirect("/sign-in");
    }

    // Sync Clerk user to our database on first visit
    await onBoardUserToDatabase();

    return (
        <div className="min-h-screen bg-90s-tile flex flex-col text-black">
            {/* ── Windows 95 System Header ──────────────────────── */}
            <header className="bevel-outset mx-2 mt-2 bg-[#c0c0c0] sticky top-0 z-50">
                {/* Title Bar */}
                <div className="win-titlebar">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">💾</span>
                        <span>Craftly_Studio_95.exe - [Website Projects Explorer]</span>
                    </div>
                    <div className="flex items-center">
                        <span className="win-btn-control">_</span>
                        <span className="win-btn-control">□</span>
                        <Link href="/" className="win-btn-control text-black no-underline">✕</Link>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#808080] text-xs">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="font-black text-sm tracking-tight text-black no-underline flex items-center gap-1.5">
                            <span className="bg-[#000080] text-white px-1.5 py-0.5 border border-black font-mono font-bold">C:\&gt;</span>
                            <span className="font-black text-base">CRAFT<span className="text-[#0000ff]">LY</span></span>
                        </Link>

                        <div className="hidden sm:flex items-center gap-1 border-l border-[#808080] pl-3">
                            <Link
                                href="/projects"
                                className="btn-win95 text-xs py-1 px-2.5 flex items-center gap-1.5"
                            >
                                <span>📁</span>
                                <span>My Websites</span>
                            </Link>
                            <Link
                                href="/"
                                className="btn-win95 text-xs py-1 px-2.5 flex items-center gap-1.5"
                            >
                                <span>🌐</span>
                                <span>Home</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right Toolbar Actions */}
                    <div className="flex items-center gap-3">
                        <span className="hidden md:inline font-mono text-[11px] text-[#808080]">
                            READY (Pure HTML/CSS/JS Engine)
                        </span>
                        <div className="bevel-outset p-0.5 bg-[#c0c0c0] flex items-center">
                            <UserButton />
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Main Workspace ─────────────────────────────────── */}
            <main className="flex-1 flex flex-col">
                {children}
            </main>
        </div>
    );
}
