import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
    const { userId } = await auth();

    return (
        <div className="min-h-screen flex flex-col bg-90s-tile text-black">
            {/* ── Top Marquee Announcement Ticker ─────────────────────── */}
            <div className="marquee-container" aria-label="Announcement Ticker">
                <div className="marquee-content">
                    <span className="mx-6">
                        🚨 <strong style={{ color: "#ffffff" }}>CRAFTLY v1.0 RELEASED:</strong> BACK TO THE BASICS! GENERATE PURE HTML, CSS & JAVASCRIPT WEBSITES WITH AI 🚨
                    </span>
                    <span className="mx-6 text-[#00ff00]">
                        ★ NO NODE_MODULES ★ NO WEBPACK ★ NO BUILD FAILURES ★ 100% CLEAN SOURCE CODE ★
                    </span>
                    <span className="mx-6 text-[#ff5555]">
                        ⚡ INSTANT SANDBOX PREVIEWS • DOWNLOAD RAW .ZIP • RUNS EVERYWHERE ⚡
                    </span>
                    <span className="mx-6">
                        🚨 <strong style={{ color: "#ffffff" }}>CRAFTLY v1.0 RELEASED:</strong> BACK TO THE BASICS! GENERATE PURE HTML, CSS & JAVASCRIPT WEBSITES WITH AI 🚨
                    </span>
                    <span className="mx-6 text-[#00ff00]">
                        ★ NO NODE_MODULES ★ NO WEBPACK ★ NO BUILD FAILURES ★ 100% CLEAN SOURCE CODE ★
                    </span>
                    <span className="mx-6 text-[#ff5555]">
                        ⚡ INSTANT SANDBOX PREVIEWS • DOWNLOAD RAW .ZIP • RUNS EVERYWHERE ⚡
                    </span>
                </div>
            </div>

            {/* ── Windows 95 Navigation Bar ────────────────────────────── */}
            <header className="bevel-outset sticky top-0 z-50 mx-2 mt-2 bg-[#c0c0c0]">
                {/* Title Bar */}
                <div className="win-titlebar">
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 bg-[#ffff00] border border-black" />
                        <span>Craftly_Studio_95.exe - [Internet Webmaster Edition]</span>
                    </div>
                    <div className="flex items-center">
                        <span className="win-btn-control">_</span>
                        <span className="win-btn-control">□</span>
                        <span className="win-btn-control text-[#ff0000]">✕</span>
                    </div>
                </div>

                {/* Menu Bar */}
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#808080] text-xs">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="font-black text-sm tracking-tight text-black no-underline flex items-center gap-1.5">
                            <span className="bg-[#000080] text-white px-1.5 py-0.5 border border-black font-mono font-bold">C:\&gt;</span>
                            <span className="font-black text-base">CRAFT<span className="text-[#0000ff]">LY</span></span>
                        </Link>
                        <div className="hidden md:flex items-center gap-3 text-black">
                            <span className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5 cursor-pointer select-none"><u>F</u>ile</span>
                            <span className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5 cursor-pointer select-none"><u>E</u>dit</span>
                            <a href="#features" className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5 cursor-pointer select-none no-underline text-black"><u>V</u>iew Features</a>
                            <a href="#comparison" className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5 cursor-pointer select-none no-underline text-black"><u>C</u>omparison</a>
                            <a href="#showcase" className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5 cursor-pointer select-none no-underline text-black"><u>T</u>emplates</a>
                        </div>
                    </div>

                    {/* Auth Nav Actions */}
                    <div className="flex items-center gap-2">
                        {userId ? (
                            <>
                                <Link href="/projects" className="btn-win95 btn-win95-primary text-xs py-1 px-3">
                                    📁 My Websites →
                                </Link>
                                <UserButton />
                            </>
                        ) : (
                            <>
                                <Link href="/sign-in" className="btn-win95 text-xs py-1 px-3">
                                    Sign In
                                </Link>
                                <Link href="/sign-in" className="btn-win95 btn-win95-primary text-xs py-1 px-3">
                                    ⚡ Start Crafting
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* ── Main Body ────────────────────────────────────────────── */}
            <main className="flex-1 max-w-5xl w-full mx-auto px-3 py-6">
                
                {/* ── Hero Section (Windows 95 Window Aesthetic) ──────── */}
                <section className="win-window mb-8">
                    <div className="win-titlebar">
                        <div className="flex items-center gap-2">
                            <span>💾 C:\PROGRAMS\CRAFTLY\HTML_GENERATOR.EXE</span>
                            <span className="badge-new">NEW v1.0</span>
                        </div>
                        <div className="flex items-center">
                            <span className="win-btn-control">_</span>
                            <span className="win-btn-control">□</span>
                            <span className="win-btn-control">✕</span>
                        </div>
                    </div>

                    <div className="p-4 md:p-6 bg-[#c0c0c0]">
                        {/* Under Construction / Retro Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="badge-hot">🔥 100% PURE HTML/CSS/JS</span>
                            <span className="badge-retro font-mono">⚡ ZERO RUNTIME OVERHEAD</span>
                            <span className="badge-retro font-mono">🌐 W3C COMPLIANT CODE</span>
                            <span className="badge-retro font-mono hidden sm:inline-block">💾 WORKS OFFLINE</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                            {/* Left Text */}
                            <div className="lg:col-span-7">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-3">
                                    Build Websites{" "}
                                    <span className="text-rainbow block text-4xl sm:text-5xl md:text-6xl mt-1">
                                        Back to the Basics.
                                    </span>
                                </h1>

                                <div className="panel-notepad mb-4 text-sm font-sans">
                                    <p className="font-bold text-black mb-1">
                                        📝 <u>THE NO-FRAMEWORK REVOLUTION:</u>
                                    </p>
                                    <p className="text-black leading-relaxed">
                                        Tired of 500MB <code className="bg-white px-1 border border-black font-mono">node_modules</code> and broken build pipelines? Craftly AI writes clean, handcrafted <strong>index.html</strong>, <strong>style.css</strong>, and <strong>script.js</strong> from your plain text prompts.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <Link
                                        href={userId ? "/projects" : "/sign-in"}
                                        className="btn-win95 btn-win95-primary text-sm py-2.5 px-6 font-bold flex items-center gap-2"
                                    >
                                        <span>🚀 CRAFT A WEBSITE NOW</span>
                                        <span>→</span>
                                    </Link>
                                    <a
                                        href="#comparison"
                                        className="btn-win95 text-sm py-2.5 px-4 font-bold"
                                    >
                                        🔍 Why Pure HTML?
                                    </a>
                                </div>

                                {/* Hit Counter Box */}
                                <div className="bevel-outset p-2 inline-flex items-center gap-3 bg-[#c0c0c0]">
                                    <span className="font-mono text-xs uppercase font-bold text-black">VISITOR COUNTER:</span>
                                    <div className="hit-counter">
                                        <span>0</span>
                                        <span>0</span>
                                        <span>4</span>
                                        <span>8</span>
                                        <span>2</span>
                                        <span>9</span>
                                        <span>1</span>
                                    </div>
                                    <span className="text-xs text-[#808080] font-mono hidden sm:inline">SINCE 1996</span>
                                </div>
                            </div>

                            {/* Right Interactive Mock Window */}
                            <div className="lg:col-span-5">
                                <div className="win-window">
                                    <div className="win-titlebar bg-gradient-to-r from-[#000080] to-[#1084d0]">
                                        <div className="flex items-center gap-1.5 text-xs">
                                            <span>📄 index.html • style.css • app.js</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="win-btn-control">✕</span>
                                        </div>
                                    </div>

                                    {/* Code Preview Pane */}
                                    <div className="bevel-inset p-3 bg-white font-mono text-xs leading-tight overflow-x-auto text-black">
                                        <div className="text-[#808080] mb-1">
                                            &lt;!-- Generated by Craftly AI --&gt;
                                        </div>
                                        <div>
                                            <span className="text-[#0000ff]">&lt;!DOCTYPE</span> <span className="text-[#800080]">html</span>&gt;
                                        </div>
                                        <div>
                                            <span className="text-[#0000ff]">&lt;html</span> <span className="text-[#ff0000]">lang</span>=<span className="text-[#008000]">&quot;en&quot;</span>&gt;
                                        </div>
                                        <div className="pl-3">
                                            <span className="text-[#0000ff]">&lt;head&gt;</span>
                                        </div>
                                        <div className="pl-6 text-[#808080]">
                                            &lt;title&gt;Retro Arcade 1999&lt;/title&gt;
                                        </div>
                                        <div className="pl-6">
                                            <span className="text-[#0000ff]">&lt;link</span> <span className="text-[#ff0000]">rel</span>=<span className="text-[#008000]">&quot;stylesheet&quot;</span> <span className="text-[#ff0000]">href</span>=<span className="text-[#008000]">&quot;style.css&quot;</span>&gt;
                                        </div>
                                        <div className="pl-3">
                                            <span className="text-[#0000ff]">&lt;/head&gt;</span>
                                        </div>
                                        <div className="pl-3">
                                            <span className="text-[#0000ff]">&lt;body&gt;</span>
                                        </div>
                                        <div className="pl-6 text-[#000080] font-bold">
                                            &lt;canvas id=&quot;game&quot; width=&quot;400&quot; height=&quot;300&quot;&gt;&lt;/canvas&gt;
                                        </div>
                                        <div className="pl-6">
                                            <span className="text-[#0000ff]">&lt;script</span> <span className="text-[#ff0000]">src</span>=<span className="text-[#008000]">&quot;app.js&quot;</span>&gt;&lt;/script&gt;
                                        </div>
                                        <div className="pl-3">
                                            <span className="text-[#0000ff]">&lt;/body&gt;</span>
                                        </div>
                                        <div>
                                            <span className="text-[#0000ff]">&lt;/html&gt;</span>
                                        </div>

                                        <div className="mt-3 pt-2 border-t border-[#808080] flex items-center justify-between text-[11px] text-[#808080]">
                                            <span>✓ Ready to preview</span>
                                            <span className="text-[#00aa00] font-bold">0.02s Load Time</span>
                                        </div>
                                    </div>

                                    {/* Action bar */}
                                    <div className="mt-2 flex items-center justify-between gap-2 px-1">
                                        <span className="text-[11px] font-mono text-[#808080]">3 files • 1.4 KB total</span>
                                        <span className="btn-win95 btn-win95-success text-[11px] py-0.5 px-2">
                                            ▶ LIVE PREVIEW
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="hr-groove" />

                {/* ── Comparison Section: Pure HTML/CSS/JS vs Modern Bloat ── */}
                <section id="comparison" className="win-window mb-8">
                    <div className="win-titlebar">
                        <div className="flex items-center gap-2">
                            <span>⚖️ SYSTEM COMPARISON: PURE BASICS VS. OVERENGINEERED BLOAT</span>
                        </div>
                        <div className="flex items-center">
                            <span className="win-btn-control">_</span>
                            <span className="win-btn-control">□</span>
                            <span className="win-btn-control">✕</span>
                        </div>
                    </div>

                    <div className="p-4 bg-[#c0c0c0]">
                        <p className="text-xs font-mono mb-3 text-black">
                            Table 1.1: Why going back to raw HTML, CSS and Vanilla JavaScript wins every single time.
                        </p>

                        <div className="overflow-x-auto bevel-inset">
                            <table className="table-retro">
                                <thead>
                                    <tr>
                                        <th style={{ width: "25%" }}>Feature</th>
                                        <th style={{ width: "37%", background: "#ffffcc" }}>Craftly 95 (Pure HTML/CSS/JS)</th>
                                        <th style={{ width: "38%" }}>Heavy JS Frameworks (Next/React)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="font-bold">Dependencies</td>
                                        <td className="text-[#00aa00] font-bold bg-[#ffffcc]">0 packages (0 KB node_modules)</td>
                                        <td className="text-[#ff0000]">1,400 packages (450 MB node_modules)</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold">Build Step Required?</td>
                                        <td className="text-[#00aa00] font-bold bg-[#ffffcc]">None! Double click .html to run</td>
                                        <td className="text-[#ff0000]">Webpack / Vite / Babel compiling</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold">Load Speed</td>
                                        <td className="text-[#00aa00] font-bold bg-[#ffffcc]">&lt; 30 milliseconds (Instant)</td>
                                        <td className="text-[#ff0000]">2.5 - 6.0 seconds hydration</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold">Hosting Compatibility</td>
                                        <td className="text-[#00aa00] font-bold bg-[#ffffcc]">Any web host, USB drive, floppy disk, S3</td>
                                        <td className="text-[#ff0000]">Specialized Node.js edge serverless hosts</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold">Longevity & Stability</td>
                                        <td className="text-[#00aa00] font-bold bg-[#ffffcc]">Works today, worked in 1996, works in 2050</td>
                                        <td className="text-[#ff0000]">Deprecated after 6 months (Major breaking changes)</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold">Source Code Readability</td>
                                        <td className="text-[#00aa00] font-bold bg-[#ffffcc]">Clean HTML markup, vanilla CSS, plain JS</td>
                                        <td className="text-[#ff0000]">Minified chunks, bundled transpiled JS</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <hr className="hr-groove" />

                {/* ── Feature Highlights (Windows 95 Card Grid) ────────── */}
                <section id="features" className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                                🛠️ Webmaster Toolkit Capabilities
                            </h2>
                            <p className="text-xs font-mono text-[#808080]">Everything you need to craft lightning-fast web experiences.</p>
                        </div>
                        <span className="badge-hot hidden sm:inline-flex">★ 100% PURE WEB</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Feature 1 */}
                        <div className="win-window">
                            <div className="win-titlebar">
                                <span>1. Natural Language to HTML</span>
                                <span className="win-btn-control">_</span>
                            </div>
                            <div className="p-3 bg-[#c0c0c0]">
                                <div className="bevel-inset p-3 bg-white mb-2 min-h-[100px]">
                                    <div className="text-lg font-black uppercase text-black mb-1">🤖 AI Web Architect</div>
                                    <p className="text-xs text-black leading-relaxed">
                                        Describe your layout, widgets, animations, or logic in plain English. The AI generates semantic, accessible HTML5 elements.
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] font-mono text-[#0000ff] font-bold">index.html ✓</span>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="win-window">
                            <div className="win-titlebar">
                                <span>2. Handcrafted CSS3 Styling</span>
                                <span className="win-btn-control">_</span>
                            </div>
                            <div className="p-3 bg-[#c0c0c0]">
                                <div className="bevel-inset p-3 bg-white mb-2 min-h-[100px]">
                                    <div className="text-lg font-black uppercase text-black mb-1">🎨 Pure CSS Power</div>
                                    <p className="text-xs text-black leading-relaxed">
                                        Zero utility bloat. Craftly produces structured CSS stylesheets with Flexbox, CSS Grid, keyframe animations, and responsive media queries.
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] font-mono text-[#0000ff] font-bold">styles.css ✓</span>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="win-window">
                            <div className="win-titlebar">
                                <span>3. Vanilla JavaScript Logic</span>
                                <span className="win-btn-control">_</span>
                            </div>
                            <div className="p-3 bg-[#c0c0c0]">
                                <div className="bevel-inset p-3 bg-white mb-2 min-h-[100px]">
                                    <div className="text-lg font-black uppercase text-black mb-1">⚡ Interactive JS</div>
                                    <p className="text-xs text-black leading-relaxed">
                                        Native DOM manipulation, event listeners, localStorage persistence, Canvas graphics, and Web APIs without heavy framework overhead.
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] font-mono text-[#0000ff] font-bold">script.js ✓</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="hr-groove" />

                {/* ── Templates & Presets Showcase ────────────────────── */}
                <section id="showcase" className="win-window mb-8">
                    <div className="win-titlebar">
                        <div className="flex items-center gap-2">
                            <span>📂 TEMPLATE GALLERY: WHAT YOU CAN CRAFT</span>
                        </div>
                        <div className="flex items-center">
                            <span className="win-btn-control">_</span>
                            <span className="win-btn-control">□</span>
                            <span className="win-btn-control">✕</span>
                        </div>
                    </div>

                    <div className="p-4 bg-[#c0c0c0]">
                        <p className="text-xs font-mono mb-4 text-black">
                            Select any archetype or describe your custom website idea:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                {
                                    title: "🕹️ 2D Canvas Game",
                                    desc: "Retro Space Invaders, Snake, or Pong using HTML5 Canvas & vanilla JS loop.",
                                    tag: "CANVAS + JS",
                                    tagColor: "#ff0000",
                                },
                                {
                                    title: "📋 Interactive Todo App",
                                    desc: "Task manager with local storage, drag re-ordering, and audio sound effects.",
                                    tag: "DOM + STORAGE",
                                    tagColor: "#0000ff",
                                },
                                {
                                    title: "🛍️ E-Commerce Catalog",
                                    desc: "Product grid with client-side filters, search, shopping cart modal & checkout.",
                                    tag: "FLEXBOX + JS",
                                    tagColor: "#00aa00",
                                },
                                {
                                    title: "🎨 GeoCities Portfolio",
                                    desc: "Nostalgic personal website with beveled cards, marquee ticker & retro guestbook.",
                                    tag: "RETRO CSS",
                                    tagColor: "#800080",
                                },
                            ].map((item, idx) => (
                                <div key={idx} className="bevel-outset p-3 bg-[#c0c0c0] flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span
                                                className="text-[10px] font-black text-white px-1.5 py-0.5"
                                                style={{ background: item.tagColor }}
                                            >
                                                {item.tag}
                                            </span>
                                            <span className="text-[10px] font-mono text-[#808080]">PRESET</span>
                                        </div>
                                        <h3 className="font-bold text-sm text-black mb-1">{item.title}</h3>
                                        <p className="text-xs text-black leading-normal mb-3">{item.desc}</p>
                                    </div>
                                    <Link
                                        href={userId ? "/projects" : "/sign-in"}
                                        className="btn-win95 text-xs py-1 px-2 w-full text-center"
                                    >
                                        Craft This →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <hr className="hr-groove" />

                {/* ── Construction Stripes CTA Banner ─────────────────── */}
                <section className="bevel-outset p-1 mb-8">
                    <div className="bg-construction p-6 text-center">
                        <div className="bevel-outset p-6 bg-[#c0c0c0] max-w-2xl mx-auto">
                            <div className="inline-block bg-[#000080] text-[#ffff00] px-3 py-1 font-mono font-bold text-sm mb-3 border border-black">
                                🚧 STOP OVERENGINEERING. START CRAFTING. 🚧
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black uppercase text-black mb-2">
                                Ready to Generate Clean HTML, CSS & JS?
                            </h2>
                            <p className="text-xs sm:text-sm text-black mb-4 font-sans max-w-lg mx-auto">
                                Join web developers, hobbyists, and creators rediscovering the speed, purity, and fun of raw web technologies.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <Link
                                    href={userId ? "/projects" : "/sign-in"}
                                    className="btn-win95 btn-win95-primary text-sm py-2.5 px-6 font-bold"
                                >
                                    ⚡ LAUNCH CRAFTLY STUDIO (FREE)
                                </Link>
                                <a
                                    href="#comparison"
                                    className="btn-win95 text-sm py-2.5 px-4 font-bold"
                                >
                                    📖 Read Documentation
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Retro 90s Webmaster Footer ──────────────────────── */}
                <footer className="bevel-outset p-4 bg-[#c0c0c0] text-center text-xs">
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-3 text-black font-mono">
                        <Link href="/">Home</Link>
                        <span>•</span>
                        <a href="#features">Features</a>
                        <span>•</span>
                        <a href="#comparison">Why HTML?</a>
                        <span>•</span>
                        <a href="#showcase">Presets</a>
                        <span>•</span>
                        <Link href={userId ? "/projects" : "/sign-in"}>Open Studio</Link>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
                        <span className="bevel-inset px-2 py-1 bg-white font-mono text-[11px] text-black">
                            🖥️ BEST VIEWED IN 800x600 RESOLUTION
                        </span>
                        <span className="bevel-inset px-2 py-1 bg-white font-mono text-[11px] text-black">
                            🌐 NETSCAPE 3.0 & IE 4.0 COMPATIBLE
                        </span>
                        <span className="bevel-inset px-2 py-1 bg-white font-mono text-[11px] text-black">
                            ✨ POWERED BY GEMINI AI
                        </span>
                    </div>

                    <p className="text-[11px] text-[#808080] font-mono">
                        © 1996 - 2026 Craftly. All Rights Reserved. Handcrafted with authentic HTML, CSS & JavaScript.
                    </p>
                </footer>

            </main>
        </div>
    );
}
