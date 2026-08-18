export default function Loading() {
    return (
        <div
            style={{
                display: "flex",
                height: "calc(100vh - 3.5rem)",
                overflow: "hidden",
            }}
        >
            {/* Left chat skeleton */}
            <div
                style={{
                    width: "380px",
                    minWidth: "340px",
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    borderRight: "2px solid var(--border)",
                    background: "white",
                    padding: "1rem",
                    gap: "0.75rem",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        height: "48px",
                        background: "var(--muted)",
                        borderRadius: "var(--radius-sm)",
                        animation: "pulse-glow 1.5s ease infinite",
                        marginBottom: "0.5rem",
                    }}
                />
                {/* Messages */}
                {[80, 65, 85, 55, 70].map((w, i) => (
                    <div
                        key={i}
                        style={{
                            height: "52px",
                            width: `${w}%`,
                            background: "var(--muted)",
                            borderRadius: "var(--radius-md)",
                            animation: "pulse-glow 1.5s ease infinite",
                            animationDelay: `${i * 150}ms`,
                            alignSelf: i % 2 === 0 ? "flex-end" : "flex-start",
                        }}
                    />
                ))}
            </div>

            {/* Right preview skeleton */}
            <div
                style={{
                    flex: 1,
                    background: "var(--muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <div
                    style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        border: "3px solid var(--accent)",
                        borderTopColor: "transparent",
                        animation: "spin-slow 1s linear infinite",
                    }}
                />
                <p
                    style={{
                        fontFamily: "var(--font-outfit), Outfit, sans-serif",
                        fontWeight: 600,
                        color: "var(--muted-foreground)",
                        fontSize: "0.9rem",
                    }}
                >
                    Loading project...
                </p>
            </div>
        </div>
    );
}
