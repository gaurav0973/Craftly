export default function Loading() {
    return (
        <div className="flex-1 p-4 bg-90s-tile flex items-center justify-center min-h-[calc(100vh-4.2rem)]">
            <div className="win-window max-w-sm w-full p-6 text-center shadow-xl">
                <div className="win-titlebar -mx-6 -mt-6 mb-4">
                    <div className="flex items-center gap-1.5 text-xs">
                        <span>⏳</span>
                        <span>Craftly_Engine.exe - [Craftly 95: Make AI Mediocre Again]</span>
                    </div>
                </div>

                <div className="text-3xl mb-3 animate-bounce">💾</div>
                <h3 className="font-bold text-sm uppercase text-black mb-1">
                    Loading Craftly 95 Workspace...
                </h3>
                <p className="font-mono text-xs text-[#808080] mb-4">
                    Craftly is an AI website builder that generates pure HTML/CSS/JavaScript.
                </p>

                {/* Retro Beveled Progress Bar */}
                <div className="bevel-inset p-1 bg-white mb-2">
                    <div className="h-5 bg-[#000080] flex items-center justify-center text-[10px] font-mono text-white font-bold animate-pulse">
                        PLEASE WAIT...
                    </div>
                </div>
            </div>
        </div>
    );
}
