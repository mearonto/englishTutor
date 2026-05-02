import type { CSSProperties } from "react";

export type KnowledgeCardData = {
  word: string;
  definition: string;
  contextSentence: string;
  coach: string;
  type: string;
  subject: string;
  correct: boolean;
  imageUrl?: string;
};

interface KnowledgeCardProps {
  data: KnowledgeCardData;
  onDismiss: () => void;
}

const SUBJECT_COLORS: Record<string, string> = {
  astronomy: "#0369a1",
  canada: "#c2410c",
  "math-kangaroo": "#0f766e",
  leon: "#7c3aed",
  english: "#1e40af",
};

const SUBJECT_ICONS: Record<string, string> = {
  astronomy: "🔭",
  canada: "🍁",
  "math-kangaroo": "🦘",
  leon: "🧮",
  english: "📚",
};

const TYPE_LABELS: Record<string, string> = {
  "solar-system": "Solar System",
  "stars-galaxies": "Stars & Galaxies",
  "space-exploration": "Space Exploration",
  "nasa-ksc": "NASA / KSC",
  "earth-space": "Earth & Space",
  "fun-fact": "Fun Fact",
  "astronomy-vocab": "Astronomy Vocab",
  "kangaroo-g5": "Grade 5",
  "kangaroo-g6": "Grade 6",
  "kangaroo-g7": "Grade 7",
  "kangaroo-g8": "Grade 8",
  math: "Math",
  science: "Science",
  "social-studies": "Social Studies",
  "language-arts": "Language Arts",
  health: "Health",
  multiply: "Multiplication",
  addition: "Addition",
  subtraction: "Subtraction",
  spelling: "Spelling",
  homophone: "Homophone",
  prefix: "Prefix",
  suffix: "Suffix",
  "multiple-meaning": "Multiple Meaning",
  "word-relationships": "Word Relationships",
  "compound-word": "Compound Word",
  "context-clues": "Context Clues",
};

export function KnowledgeCard({ data, onDismiss }: KnowledgeCardProps) {
  const { word, definition, contextSentence, coach, type, subject, correct, imageUrl } = data;
  const color = SUBJECT_COLORS[subject] ?? "#334155";
  const icon = SUBJECT_ICONS[subject] ?? "📖";
  const typeLabel = TYPE_LABELS[type] ?? type;

  const overlay: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 500,
    display: "flex",
    alignItems: "flex-end",
    pointerEvents: "auto",
  };

  const backdrop: CSSProperties = {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
  };

  const card: CSSProperties = {
    position: "relative",
    width: "100%",
    maxHeight: "55vh",
    overflowY: "auto",
    background: "#ffffff",
    borderRadius: "20px 20px 0 0",
    boxShadow: "0 -4px 32px rgba(0,0,0,0.18)",
    animation: "slideUp 0.25s ease-out",
  };

  const header: CSSProperties = {
    background: color,
    borderRadius: "20px 20px 0 0",
    padding: "0.75rem 1.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#fff",
  };

  const body: CSSProperties = {
    padding: "1.1rem 1.4rem 1.4rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.85rem",
  };

  return (
    <div style={overlay}>
      <div style={backdrop} onClick={onDismiss} />
      <div style={card}>
        {/* Header */}
        <div style={header}>
          <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
            {icon} {typeLabel}
          </span>
          <span style={{
            fontWeight: 800,
            fontSize: "0.95rem",
            background: correct ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.2)",
            borderRadius: 12,
            padding: "2px 12px",
          }}>
            {correct ? "✓ Correct!" : "Keep going!"}
          </span>
        </div>

        {/* Body */}
        <div style={body}>
          {/* Question image */}
          {imageUrl && (
            <div style={{ textAlign: "center" }}>
              <img
                src={imageUrl}
                alt=""
                style={{ maxHeight: 150, maxWidth: "100%", borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
              />
            </div>
          )}

          {/* Word / concept */}
          <div style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            color: color,
            letterSpacing: "0.01em",
            lineHeight: 1.2,
          }}>
            {word}
          </div>

          {/* Definition */}
          {definition && (
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.08em", color: "#94a3b8", marginBottom: "0.2rem" }}>
                📖 Definition
              </div>
              <div style={{ fontSize: "0.97rem", color: "#1e293b", lineHeight: 1.55 }}>
                {definition}
              </div>
            </div>
          )}

          {/* Context sentence */}
          {contextSentence && (
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.08em", color: "#94a3b8", marginBottom: "0.2rem" }}>
                💬 In context
              </div>
              <div style={{ fontSize: "0.97rem", color: "#334155", lineHeight: 1.55,
                fontStyle: "italic", borderLeft: `3px solid ${color}`, paddingLeft: "0.7rem" }}>
                {contextSentence}
              </div>
            </div>
          )}

          {/* Coach note — only show if it adds info beyond the definition */}
          {coach && coach !== definition && !coach.startsWith("Correct") && (
            <div style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.5,
              background: "#f8fafc", borderRadius: 8, padding: "0.55rem 0.8rem" }}>
              {coach}
            </div>
          )}

          {/* Dismiss button */}
          <button
            onClick={onDismiss}
            style={{
              marginTop: "0.25rem",
              background: color,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "0.7rem 1.5rem",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              alignSelf: "stretch",
              letterSpacing: "0.02em",
            }}
          >
            Got it! →
          </button>
        </div>
      </div>
    </div>
  );
}
