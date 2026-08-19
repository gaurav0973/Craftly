import Link from "next/link";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-90s-tile flex flex-col items-center justify-center p-4">
            {/* Windows 95 Auth Dialog Box */}
            <div className="win-window max-w-md w-full shadow-2xl">
                {/* Title Bar */}
                <div className="win-titlebar">
                    <div className="flex items-center gap-2">
                        <span className="font-mono">🔐</span>
                        <span>Craftly_Auth_Dialog.exe - [Windows 95 Security]</span>
                    </div>
                    <div className="flex items-center">
                        <Link href="/" className="win-btn-control text-black no-underline">
                            ✕
                        </Link>
                    </div>
                </div>

                {/* Dialog Content */}
                <div className="p-4 sm:p-6 bg-[#c0c0c0]">
                    {/* Header Banner */}
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#808080]">
                        <div className="w-10 h-10 bg-[#000080] text-white flex items-center justify-center font-mono font-bold text-lg border-2 border-white shadow-[1px_1px_0_#000000]">
                            C:\
                        </div>
                        <div>
                            <h1 className="text-lg font-black uppercase text-black tracking-tight">
                                Craftly Studio Login
                            </h1>
                            <p className="text-xs font-mono text-[#808080]">
                                Authenticate to access your HTML, CSS & JS workspaces.
                            </p>
                        </div>
                    </div>

                    {/* Clerk Component Container */}
                    <div className="bevel-inset p-2 bg-white mb-4">
                        {children}
                    </div>

                    {/* Dialog Footer Actions */}
                    <div className="flex items-center justify-between pt-2 text-xs font-mono">
                        <Link href="/" className="text-[#0000ff] underline hover:text-[#ff0000]">
                            ← Back to Home
                        </Link>
                        <span className="text-[#808080]">System Status: Online</span>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright Note */}
            <p className="mt-4 text-xs font-mono text-[#808080] text-center">
                Craftly Web Engine • 100% Client-Side Pure HTML/CSS/JS Generator
            </p>
        </div>
    );
}
