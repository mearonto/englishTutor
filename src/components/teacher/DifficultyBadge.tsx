interface Props {
  level: number;
  size?: "sm" | "md";
}

const LABELS: Record<number, string> = {
  1: "Easy",
  2: "Medium",
  3: "Standard",
  4: "Advanced",
  5: "Expert",
};
const COLORS: Record<number, { bg: string; color: string }> = {
  1: { bg: "#dcfce7", color: "#166534" },
  2: { bg: "#dbeafe", color: "#1e40af" },
  3: { bg: "#fef9c3", color: "#854d0e" },
  4: { bg: "#ffedd5", color: "#9a3412" },
  5: { bg: "#fee2e2", color: "#991b1b" },
};

export function DifficultyBadge({ level, size = "md" }: Props) {
  const { bg, color } = COLORS[level] ?? COLORS[3];
  const label = LABELS[level] ?? String(level);
  return (
    <span style={{
      background: bg, color, fontWeight: 700,
      borderRadius: 20,
      padding: size === "sm" ? "1px 7px" : "2px 10px",
      fontSize: size === "sm" ? "0.7rem" : "0.8rem",
      whiteSpace: "nowrap",
    }}>
      {level} · {label}
    </span>
  );
}
