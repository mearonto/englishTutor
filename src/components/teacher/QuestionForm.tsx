import { useState, useEffect } from "react";
import { questionsApi, uploadApi, type ApiQuestion } from "../../api/client";

const SUBJECTS = ["astronomy", "canada", "math-kangaroo", "english"];

const CATEGORIES: Record<string, string[]> = {
  astronomy: ["solar-system", "stars-galaxies", "space-exploration", "nasa-ksc", "earth-space", "fun-fact", "astronomy-vocab"],
  canada: ["math", "science", "social-studies", "language-arts", "health"],
  "math-kangaroo": ["kangaroo-g5", "kangaroo-g6", "kangaroo-g7", "kangaroo-g8"],
  english: ["spelling", "homophone", "prefix", "suffix", "multiple-meaning", "word-relationships", "compound-word", "context-clues"],
};

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Easy", 2: "Medium", 3: "Standard", 4: "Advanced", 5: "Expert",
};

interface Props {
  question?: ApiQuestion | null;   // null = create mode
  onSave: () => void;
  onClose: () => void;
}

function blank(): Partial<ApiQuestion> {
  return {
    subject: "astronomy", type: "solar-system", grade: 0,
    word: "", prompt: "", choices: ["", "", "", ""], answer: "",
    definition: "", context_sentence: "", hints: ["", ""],
    coach: "", difficulty: 3, active: true,
  };
}

export function QuestionForm({ question, onSave, onClose }: Props) {
  const [form, setForm] = useState<Partial<ApiQuestion>>(question ?? blank());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm(question ?? blank());
    setError("");
  }, [question]);

  const set = <K extends keyof ApiQuestion>(key: K, val: ApiQuestion[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const setChoice = (i: number, val: string) => {
    const choices = [...(form.choices ?? ["", "", "", ""])];
    choices[i] = val;
    setForm((f) => ({ ...f, choices }));
  };

  const setHint = (i: number, val: string) => {
    const hints: [string, string] = [...(form.hints ?? ["", ""])] as [string, string];
    hints[i] = val;
    setForm((f) => ({ ...f, hints }));
  };

  const handleSubjectChange = (sub: string) => {
    const cat = CATEGORIES[sub]?.[0] ?? "";
    setForm((f) => ({ ...f, subject: sub, type: cat }));
  };

  const validate = (): string => {
    if (!form.word?.trim()) return "Word is required";
    if (!form.prompt?.trim()) return "Prompt is required";
    if (!form.definition?.trim()) return "Definition is required";
    const choices = form.choices?.filter(Boolean) ?? [];
    if (choices.length < 2) return "At least 2 choices are required";
    if (!form.answer?.trim()) return "Answer is required";
    if (!choices.includes(form.answer)) return "Answer must match one of the choices";
    return "";
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        choices: form.choices?.filter(Boolean),
      };
      if (question?.id) {
        await questionsApi.update(question.id, payload);
      } else {
        await questionsApi.create(payload);
      }
      onSave();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const cats = CATEGORIES[form.subject ?? "astronomy"] ?? [];

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>{question ? "Edit Question" : "Add Question"}</h3>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.body}>
          <div style={styles.row}>
            <label style={styles.label}>Subject</label>
            <select style={styles.select} value={form.subject} onChange={(e) => handleSubjectChange(e.target.value)}>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={styles.row}>
            <label style={styles.label}>Category</label>
            {cats.length > 0 ? (
              <select style={styles.select} value={form.type} onChange={(e) => set("type", e.target.value as ApiQuestion["type"])}>
                {cats.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            ) : (
              <input style={styles.input} value={form.type ?? ""} onChange={(e) => set("type", e.target.value as ApiQuestion["type"])} />
            )}
          </div>

          <div style={styles.row}>
            <label style={styles.label}>Grade (0 = all)</label>
            <input style={{ ...styles.input, width: 80 }} type="number" min={0} max={12}
              value={form.grade ?? 0} onChange={(e) => set("grade", Number(e.target.value))} />
          </div>

          <div style={styles.row}>
            <label style={styles.label}>Word / Key Term</label>
            <input style={styles.input} value={form.word ?? ""} onChange={(e) => set("word", e.target.value)} />
          </div>

          <div style={styles.row}>
            <label style={styles.label}>Prompt / Question</label>
            <textarea style={styles.textarea} rows={2} value={form.prompt ?? ""} onChange={(e) => set("prompt", e.target.value)} />
          </div>

          <div style={styles.row}>
            <label style={styles.label}>Choices (4)</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
              {(form.choices ?? ["", "", "", ""]).map((c, i) => (
                <input key={i} style={styles.input} placeholder={`Choice ${i + 1}`}
                  value={c} onChange={(e) => setChoice(i, e.target.value)} />
              ))}
            </div>
          </div>

          <div style={styles.row}>
            <label style={styles.label}>Correct Answer</label>
            <select style={styles.select} value={form.answer ?? ""}
              onChange={(e) => set("answer", e.target.value)}>
              <option value="">— select —</option>
              {(form.choices ?? []).filter(Boolean).map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={styles.row}>
            <label style={styles.label}>Definition</label>
            <textarea style={styles.textarea} rows={2} value={form.definition ?? ""} onChange={(e) => set("definition", e.target.value)} />
          </div>

          <div style={styles.row}>
            <label style={styles.label}>Context Sentence</label>
            <textarea style={styles.textarea} rows={2} value={form.context_sentence ?? ""} onChange={(e) => set("context_sentence", e.target.value)} />
          </div>

          <div style={styles.row}>
            <label style={styles.label}>Hint 1</label>
            <input style={styles.input} value={form.hints?.[0] ?? ""} onChange={(e) => setHint(0, e.target.value)} />
          </div>
          <div style={styles.row}>
            <label style={styles.label}>Hint 2</label>
            <input style={styles.input} value={form.hints?.[1] ?? ""} onChange={(e) => setHint(1, e.target.value)} />
          </div>

          <div style={styles.row}>
            <label style={styles.label}>Coach text</label>
            <textarea style={styles.textarea} rows={2} value={form.coach ?? ""} onChange={(e) => set("coach", e.target.value)} />
          </div>

          <div style={styles.row}>
            <label style={styles.label}>
              Difficulty: <strong>{form.difficulty}</strong> · {DIFFICULTY_LABELS[form.difficulty ?? 3]}
            </label>
            <input type="range" min={1} max={5} value={form.difficulty ?? 3}
              onChange={(e) => set("difficulty", Number(e.target.value))}
              style={{ flex: 1, accentColor: "#3b82f6" }} />
          </div>

          <div style={styles.row}>
            <label style={styles.label}>Active</label>
            <input type="checkbox" checked={form.active ?? true}
              onChange={(e) => set("active", e.target.checked)} />
          </div>

          <div style={styles.row}>
            <label style={styles.label}>Image</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              {form.image_url && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img src={form.image_url} alt="" style={{ maxHeight: 80, borderRadius: 6,
                    border: "1px solid #e2e8f0" }} />
                  <button type="button"
                    style={{ padding: "2px 10px", background: "#fff1f2", border: "1px solid #fecdd3",
                      borderRadius: 5, cursor: "pointer", fontSize: "0.78rem", color: "#be123c" }}
                    onClick={() => set("image_url", null)}>
                    ✕ Remove
                  </button>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="file" accept="image/*" disabled={uploading}
                  style={{ fontSize: "0.85rem" }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploading(true);
                    setError("");
                    try {
                      const { url } = await uploadApi.image(file);
                      set("image_url", url);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Upload failed");
                    } finally {
                      setUploading(false);
                      e.target.value = "";
                    }
                  }} />
                {uploading && <span style={{ fontSize: "0.82rem", color: "#64748b" }}>Uploading…</span>}
              </div>
            </div>
          </div>

          {error && <p style={{ color: "#dc2626", margin: "0.5rem 0", fontSize: "0.9rem" }}>{error}</p>}
        </div>

        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={styles.saveBtn} onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving…" : question ? "Save Changes" : "Add Question"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000,
  },
  modal: {
    background: "#fff", borderRadius: 16, width: "min(680px, 95vw)",
    maxHeight: "90vh", display: "flex", flexDirection: "column",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "1rem 1.25rem", borderBottom: "1px solid #e2e8f0",
  },
  body: {
    overflowY: "auto", padding: "1rem 1.25rem",
    display: "flex", flexDirection: "column", gap: "0.6rem",
  },
  footer: {
    display: "flex", justifyContent: "flex-end", gap: "0.75rem",
    padding: "0.75rem 1.25rem", borderTop: "1px solid #e2e8f0",
  },
  row: { display: "flex", alignItems: "flex-start", gap: "0.75rem" },
  label: { minWidth: 140, fontSize: "0.85rem", color: "#475569", paddingTop: 6, fontWeight: 600 },
  input: { flex: 1, padding: "5px 8px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: "0.9rem" },
  select: { flex: 1, padding: "5px 8px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: "0.9rem" },
  textarea: { flex: 1, padding: "5px 8px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: "0.9rem", resize: "vertical" },
  closeBtn: { background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748b" },
  saveBtn: { padding: "0.5rem 1.5rem", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" },
  cancelBtn: { padding: "0.5rem 1.25rem", background: "#e2e8f0", border: "none", borderRadius: 8, cursor: "pointer" },
};
