import { QueryProvider } from "@/components/providers/query-provider";
import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
    variable: "--font-plus-jakarta",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Craftly — Build Apps with AI",
    description:
        "Describe what you want to build and Craftly's AI will generate a full working app in seconds. No coding required.",
    keywords: ["AI app builder", "no-code", "app generator", "Craftly"],
    openGraph: {
        title: "Craftly — Build Apps with AI",
        description:
            "Describe what you want to build and Craftly's AI will generate a full working app in seconds.",
        type: "website",
    },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${outfit.variable} ${plusJakartaSans.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <ClerkProvider>
                    <QueryProvider>{children}</QueryProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
