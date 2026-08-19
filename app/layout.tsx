import { QueryProvider } from "@/components/providers/query-provider";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
    title: "Craftly 95 — Pure HTML, CSS & JavaScript AI Website Generator",
    description:
        "Generate 100% clean, authentic, dependency-free HTML, CSS, and JavaScript websites in seconds with AI. Back to the web fundamentals!",
    keywords: [
        "HTML CSS JS generator",
        "AI website builder",
        "no-framework",
        "pure HTML",
        "retro web",
        "Craftly",
    ],
    openGraph: {
        title: "Craftly 95 — Pure HTML, CSS & JS AI Builder",
        description:
            "Describe your website idea and Craftly generates clean HTML, CSS & JS files with live instant sandbox preview.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="h-full bg-90s-tile">
            <body className="min-h-full flex flex-col bg-90s-tile text-black font-sans antialiased selection:bg-[#000080] selection:text-white">
                <ClerkProvider>
                    <QueryProvider>{children}</QueryProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
