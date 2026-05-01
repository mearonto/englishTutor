import { useState, useRef } from "react";
import { questionsApi } from "../../api/client";

interface Props {
  onImported: () => void;
  onClose: () => void;
}

export function ImportQuestions({ onImported, onClose }: Props) {
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const parseText = (raw: string): unknown[] | string => {
    raw = raw.trim();
    if (raw.startsWith("[") || raw.startsWith("{")) {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return "Invalid JSON — check the format.";
      }
    }
    // CSV: id,grade,type,word,prompt,choice1,choice2,choice3,answer,definition,contextSentence,hint1,hint2,coach
    const lines = raw.split("\n").filter(Boolean);
    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const rows = lines.slice(1).map((line) => {
      const cols = line.split(",");
      const obj: Record<string, unknown> = {};
      header.forEach((h, i) => { obj[h] = cols[i]?.trim() ?? ""; });
      return {
        subject: "english",
        type: obj.type ?? "spelling",
        grade: Number(obj.grade ?? 0),
        word: obj.word ?? "",
        prompt: obj.prompt ?? "",
        choices: [obj.choice1, obj.choice2, obj.choice3, obj.answer].filter(Boolean),
        answer: obj.answer ?? "",
        definition: obj.definition ?? "",
        context_sentence: obj.contextsentence ?? obj["context_sentence"] ?? "",
        hints: [obj.hint1 ?? "", obj.hint2 ?? ""],
        coach: obj.coach ?? "",
        difficulty: 3,
        active: true,
      };
    });
    return rows;
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const raw = await file.text();
    setText(raw);
    setPreview(null);
    setError("");
    setResult(null);
  };

  const handlePreview = () => {
    const parsed = parseText(text);
    if (typeof parsed === "string") { setError(parsed); setPreview(null); return; }
    setPreview(`${parsed.length} questions ready to import`);
    setError("");
  };

  const handleImport = async () => {
    const parsed = parseText(text);
    if (typeof parsed === "string") { setError(parsed); return; }
    setImporting(true);
    setError("");
    try {
      const res = await questionsApi.bulk(parsed as Parameters<typeof questionsApi.bulk>[0]);
      setResult(`✓ Imported ${res.inserted} questions`);
      setText("");
      setPreview(null);
      onImported();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        <div style={header}>
          <h3 style={{ margin: 0 }}>Import Questions</h3>
          <button style={closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={body}>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
            Paste JSON array or CSV. CSV headers:<br />
            <code>id, grade, type, word, prompt, choice1, choice2, choice3, answer, definition, contextSentence, hint1, hint2, coach</code>
          </p>

          <input ref={fileRef} type="file" accept=".json,.csv"
            style={{ display: "none" }} onChange={handleFile} />
          <button style={fileBtn} onClick={() => fileRef.current?.click()}>
            📁 Choose file (.json / .csv)
          </button>

          <textarea
            style={ta}
            rows={10}
            placeholder="Or paste JSON / CSV here…"
            value={text}
            onChange={(e) => { setText(e.target.value); setPreview(null); setError(""); setResult(null); }}
          />

          {preview && <p style={{ color: "#166534", margin: 0 }}>{preview}</p>}
          {error && <p style={{ color: "#dc2626", margin: 0 }}>{error}</p>}
          {result && <p style={{ color: "#166534", fontWeight: 700, margin: 0 }}>{result}</p>}
        </div>
        <div style={footer}>
          <button style={cancelBtn} onClick={onClose}>Close</button>
          <button style={previewBtn} onClick={handlePreview} disabled={!text.trim()}>Preview</button>
          <button style={importBtn} onClick={handleImport} disabled={importing || !text.trim()}>
            {importing ? "Importing…" : "Import"}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10001,
};
const modal: React.CSSProperties = {
  background: "#fff", borderRadius: 16, width: "min(600px, 95vw)",
  maxHeight: "85vh", display: "flex", flexDirection: "column",
  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
};
const header: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "1rem 1.25rem", borderBottom: "1px solid #e2e8f0",
};
const body: React.CSSProperties = {
  overflowY: "auto", padding: "1rem 1.25rem",
  display: "flex", flexDirection: "column", gap: "0.75rem",
};
const footer: React.CSSProperties = {
  display: "flex", gap: "0.75rem", justifyContent: "flex-end",
  padding: "0.75rem 1.25rem", borderTop: "1px solid #e2e8f0",
};
const ta: React.CSSProperties = {
  border: "1px solid #cbd5e1", borderRadius: 8, padding: "0.5rem",
  fontSize: "0.85rem", fontFamily: "monospace", resize: "vertical",
};
const fileBtn: React.CSSProperties = {
  padding: "0.4rem 1rem", background: "#f1f5f9", border: "1px solid #cbd5e1",
  borderRadius: 8, cursor: "pointer", fontSize: "0.9rem", alignSelf: "flex-start",
};
const closeBtn: React.CSSProperties = { background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748b" };
const cancelBtn: React.CSSProperties = { padding: "0.5rem 1rem", background: "#e2e8f0", border: "none", borderRadius: 8, cursor: "pointer" };
const previewBtn: React.CSSProperties = { padding: "0.5rem 1rem", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: 8, cursor: "pointer" };
const importBtn: React.CSSProperties = { padding: "0.5rem 1.25rem", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" };
