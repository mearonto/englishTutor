import { useState, useEffect } from "react";
import { studentsApi, type ApiStudent } from "../../api/client";

interface Props {
  student?: ApiStudent | null;  // null = create
  onSave: () => void;
  onClose: () => void;
}

export function StudentForm({ student, onSave, onClose }: Props) {
  const [name, setName] = useState(student?.name ?? "");
  const [grade, setGrade] = useState(student?.grade_unlocked ?? 3);
  const [subject, setSubject] = useState(student?.subject ?? "english");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(student?.name ?? "");
    setGrade(student?.grade_unlocked ?? 3);
    setSubject(student?.subject ?? "english");
    setError("");
  }, [student]);

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    setError("");
    try {
      if (student?.id) {
        await studentsApi.update(student.id, { name: name.trim(), grade_unlocked: grade, subject });
      } else {
        await studentsApi.create(name.trim());
      }
      onSave();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        <div style={header}>
          <h3 style={{ margin: 0 }}>{student ? "Edit Student" : "Add Student"}</h3>
          <button style={closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={body}>
          <label style={lbl}>Name</label>
          <input style={inp} value={name} onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()} maxLength={40} />

          <label style={lbl}>Grade Unlocked</label>
          <select style={inp} value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
            <option value={3}>Grade 3</option>
            <option value={4}>Grade 4</option>
          </select>

          <label style={lbl}>Default Subject</label>
          <select style={inp} value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="english">English</option>
            <option value="astronomy">Astronomy</option>
            <option value="canada">Canada</option>
            <option value="math-kangaroo">Math Kangaroo</option>
          </select>

          {error && <p style={{ color: "#dc2626", margin: "0.25rem 0", fontSize: "0.9rem" }}>{error}</p>}
        </div>
        <div style={footer}>
          <button style={cancelBtn} onClick={onClose}>Cancel</button>
          <button style={saveBtn} onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving…" : student ? "Save" : "Add Student"}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 };
const modal: React.CSSProperties = { background: "#fff", borderRadius: 14, width: "min(420px, 92vw)", boxShadow: "0 16px 50px rgba(0,0,0,0.25)" };
const header: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", borderBottom: "1px solid #e2e8f0" };
const body: React.CSSProperties = { padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem" };
const footer: React.CSSProperties = { display: "flex", justifyContent: "flex-end", gap: "0.75rem", padding: "0.75rem 1.25rem", borderTop: "1px solid #e2e8f0" };
const lbl: React.CSSProperties = { fontSize: "0.85rem", fontWeight: 600, color: "#475569" };
const inp: React.CSSProperties = { padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: 7, fontSize: "0.9rem" };
const closeBtn: React.CSSProperties = { background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748b" };
const saveBtn: React.CSSProperties = { padding: "0.45rem 1.4rem", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 7, fontWeight: 700, cursor: "pointer" };
const cancelBtn: React.CSSProperties = { padding: "0.45rem 1.1rem", background: "#e2e8f0", border: "none", borderRadius: 7, cursor: "pointer" };
