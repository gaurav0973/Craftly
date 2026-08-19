import { QueryProvider } from "@/components/providers/query-provider";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

export const metadata: Metadata = {
    title: "Craftly 95: Make AI Mediocre Again — Pure HTML, CSS & JavaScript AI Website Generator",
    description:
        "Craftly is an AI website builder that generates pure HTML/CSS/JavaScript. Craftly 95: Make AI Mediocre Again.",
    keywords: [
        "Craftly",
        "Craftly 95",
        "Make AI Mediocre Again",
        "HTML CSS JS generator",
        "AI website builder",
        "pure HTML",
        "vanilla JavaScript",
        "retro web",
    ],
    openGraph: {
        title: "Craftly 95: Make AI Mediocre Again",
        description:
            "Craftly is an AI website builder that generates pure HTML/CSS/JavaScript with instant live preview.",
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
                <Analytics />
                <ClerkProvider>
                    <QueryProvider>{children}</QueryProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
