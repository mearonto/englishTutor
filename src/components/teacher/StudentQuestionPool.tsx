import { useState, useEffect, useCallback } from "react";
import { questionsApi, studentsApi, type ApiQuestion, type ApiStudent } from "../../api/client";
import { DifficultyBadge } from "./DifficultyBadge";

interface Props {
  student: ApiStudent;
  onClose: () => void;
}

const SUBJECTS = ["", "astronomy", "canada", "math-kangaroo", "english"];
const SUBJECT_LABELS: Record<string, string> = {
  "": "All", astronomy: "🔭 Astronomy", canada: "🍁 Canada",
  "math-kangaroo": "🦘 Math Kangaroo", english: "📖 English",
};

export function StudentQuestionPool({ student, onClose }: Props) {
  const [allQuestions, setAllQuestions] = useState<ApiQuestion[]>([]);
  const [assigned, setAssigned] = useState<Set<number>>(new Set());
  const [hasCustomPool, setHasCustomPool] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subject, setSubject] = useState("");
  const [search, setSearch] = useState("");
  const [diffMin, setDiffMin] = useState(1);
  const [diffMax, setDiffMax] = useState(5);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [allRes, poolRes] = await Promise.all([
        questionsApi.list({ limit: "2000", active: "true" }),
        studentsApi.get(student.id).then(() =>
          fetch(`/api/students/${student.id}/questions?limit=2000`).then((r) => r.json())
        ),
      ]);
      setAllQuestions(allRes.questions);
      setHasCustomPool(poolRes.custom_pool);
      if (poolRes.custom_pool) {
        const ids = new Set<number>((poolRes.questions as ApiQuestion[]).map((q) => q.id));
        setAssigned(ids);
      } else {
        // Global pool = all questions assigned conceptually
        setAssigned(new Set(allRes.questions.map((q: ApiQuestion) => q.id)));
      }
    } finally {
      setLoading(false);
    }
  }, [student.id]);

  useEffect(() => { void load(); }, [load]);

  const filtered = allQuestions.filter((q) => {
    if (subject && q.subject !== subject) return false;
    if (q.difficulty < diffMin || q.difficulty > diffMax) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      if (!q.word.toLowerCase().includes(s) && !q.prompt.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const toggleOne = (id: number) => {
    setAssigned((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    const filteredIds = filtered.map((q) => q.id);
    const allChecked = filteredIds.every((id) => assigned.has(id));
    setAssigned((prev) => {
      const next = new Set(prev);
      if (allChecked) filteredIds.forEach((id) => next.delete(id));
      else filteredIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const savePool = async () => {
    setSaving(true);
    try {
      // Clear existing, then assign current selection
      await fetch(`/api/students/${student.id}/questions`, { method: "DELETE" });
      if (assigned.size > 0) {
        await fetch(`/api/students/${student.id}/questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question_ids: [...assigned] }),
        });
      }
      setHasCustomPool(assigned.size > 0);
      alert(`Saved: ${assigned.size} questions assigned to ${student.name}`);
    } finally {
      setSaving(false);
    }
  };

  const useGlobalPool = async () => {
    if (!confirm(`Reset ${student.name} to the global question pool?`)) return;
    setSaving(true);
    try {
      await fetch(`/api/students/${student.id}/questions`, { method: "DELETE" });
      setHasCustomPool(false);
      setAssigned(new Set(allQuestions.map((q) => q.id)));
    } finally {
      setSaving(false);
    }
  };

  const filteredCheckedCount = filtered.filter((q) => assigned.has(q.id)).length;

  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        <div style={hdr}>
          <div>
            <h3 style={{ margin: 0 }}>{student.name}'s Question Pool</h3>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.8rem", color: "#64748b" }}>
              {hasCustomPool
                ? `Custom pool: ${assigned.size} questions assigned`
                : "Using global pool (all questions)"}
            </p>
          </div>
          <button style={closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Filter toolbar */}
        <div style={toolbar}>
          <select style={sel} value={subject} onChange={(e) => setSubject(e.target.value)}>
            {SUBJECTS.map((s) => <option key={s} value={s}>{SUBJECT_LABELS[s]}</option>)}
          </select>
          <input style={srch} placeholder="Search…" value={search}
            onChange={(e) => setSearch(e.target.value)} />
          <span style={{ fontSize: "0.78rem", color: "#64748b", whiteSpace: "nowrap" }}>
            Diff {diffMin}–{diffMax}
          </span>
          <input type="range" min={1} max={5} value={diffMin}
            onChange={(e) => setDiffMin(Math.min(Number(e.target.value), diffMax))}
            style={{ width: 60, accentColor: "#3b82f6" }} />
          <input type="range" min={1} max={5} value={diffMax}
            onChange={(e) => setDiffMax(Math.max(Number(e.target.value), diffMin))}
            style={{ width: 60, accentColor: "#3b82f6" }} />
        </div>

        {/* Bulk actions */}
        <div style={bulkRow}>
          <label style={{ fontSize: "0.83rem", display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
            <input type="checkbox"
              checked={filtered.length > 0 && filteredCheckedCount === filtered.length}
              onChange={toggleAll} />
            Select all {filtered.length > 0 ? `(${filteredCheckedCount}/${filtered.length} visible)` : ""}
          </label>
          <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
            {assigned.size} total selected
          </span>
        </div>

        {/* List */}
        <div style={listWrap}>
          {loading ? (
            <p style={{ color: "#94a3b8", padding: "1rem" }}>Loading…</p>
          ) : filtered.map((q) => (
            <label key={q.id} style={{ ...qRow, opacity: assigned.has(q.id) ? 1 : 0.5 }}>
              <input type="checkbox" checked={assigned.has(q.id)}
                onChange={() => toggleOne(q.id)} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ fontSize: "0.85rem" }}>{q.word}</strong>
                <span style={{ fontSize: "0.75rem", color: "#64748b", marginLeft: 6 }}>[{q.type}]</span>
                <br />
                <span style={{ fontSize: "0.75rem", color: "#475569", display: "block",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {q.prompt}
                </span>
              </span>
              <DifficultyBadge level={q.difficulty} size="sm" />
            </label>
          ))}
          {!loading && filtered.length === 0 && (
            <p style={{ color: "#94a3b8", textAlign: "center", padding: "1rem" }}>No questions match.</p>
          )}
        </div>

        <div style={footer}>
          <button style={resetBtn} onClick={useGlobalPool} disabled={saving || !hasCustomPool}>
            Use Global Pool
          </button>
          <button style={cancelBtn} onClick={onClose}>Cancel</button>
          <button style={saveBtn} onClick={savePool} disabled={saving}>
            {saving ? "Saving…" : "Save Pool"}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 };
const modal: React.CSSProperties = { background: "#fff", borderRadius: 16, width: "min(700px, 96vw)", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" };
const hdr: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "1rem 1.25rem", borderBottom: "1px solid #e2e8f0" };
const toolbar: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "0.4rem", alignItems: "center", padding: "0.75rem 1.25rem", borderBottom: "1px solid #f1f5f9" };
const bulkRow: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.4rem 1.25rem", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" };
const listWrap: React.CSSProperties = { overflowY: "auto", flex: 1, display: "flex", flexDirection: "column" };
const footer: React.CSSProperties = { display: "flex", gap: "0.6rem", justifyContent: "flex-end", padding: "0.75rem 1.25rem", borderTop: "1px solid #e2e8f0" };
const sel: React.CSSProperties = { padding: "4px 7px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: "0.82rem" };
const srch: React.CSSProperties = { flex: 1, minWidth: 120, padding: "4px 8px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: "0.82rem" };
const qRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.55rem 1.25rem", borderBottom: "1px solid #f8fafc", cursor: "pointer" };
const closeBtn: React.CSSProperties = { background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748b" };
const saveBtn: React.CSSProperties = { padding: "0.45rem 1.4rem", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 7, fontWeight: 700, cursor: "pointer" };
const cancelBtn: React.CSSProperties = { padding: "0.45rem 1rem", background: "#e2e8f0", border: "none", borderRadius: 7, cursor: "pointer" };
const resetBtn: React.CSSProperties = { padding: "0.45rem 1rem", background: "#fef9c3", border: "1px solid #fde047", borderRadius: 7, cursor: "pointer", fontSize: "0.85rem" };
