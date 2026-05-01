import { useState, useEffect, useCallback } from "react";
import { studentsApi, type ApiStudent } from "../../api/client";
import { StudentForm } from "./StudentForm";
import { StudentQuestionPool } from "./StudentQuestionPool";
import { StudentTestHistory } from "./StudentTestHistory";

export function StudentList() {
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editStudent, setEditStudent] = useState<ApiStudent | null | undefined>(undefined);
  const [poolStudent, setPoolStudent] = useState<ApiStudent | null>(null);
  const [historyStudent, setHistoryStudent] = useState<ApiStudent | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await studentsApi.list();
      setStudents(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleDelete = async (s: ApiStudent) => {
    if (!confirm(`Delete student "${s.name}"? This cannot be undone.`)) return;
    await studentsApi.remove(s.id);
    void load();
  };

  const handleReset = async (s: ApiStudent) => {
    if (!confirm(`Reset all progress for "${s.name}"?`)) return;
    await studentsApi.resetProgress(s.id);
    void load();
  };

  const handleSave = () => {
    setEditStudent(undefined);
    void load();
  };

  const masteryPercent = (s: ApiStudent) => {
    const mastery = s.mastery3 ?? {};
    const vals = Object.values(mastery);
    if (!vals.length) return 0;
    const mastered = vals.filter((v) => v >= 2).length;
    return Math.round((mastered / vals.length) * 100);
  };

  if (loading) return <p style={{ color: "#94a3b8" }}>Loading students…</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
          {students.length} student{students.length !== 1 ? "s" : ""}
        </span>
        <button style={addBtn} onClick={() => setEditStudent(null)}>+ Add Student</button>
      </div>

      <div style={grid}>
        {students.map((s) => (
          <div key={s.id} style={card}>
            {/* Avatar + name */}
            <div style={cardTop}>
              <div style={avatar}>{s.name.charAt(0).toUpperCase()}</div>
              <div>
                <div style={nameText}>{s.name}</div>
                <div style={subText}>Grade {s.grade_unlocked} · {s.subject}</div>
              </div>
            </div>

            {/* Stats row */}
            <div style={statsRow}>
              <div style={stat}><span style={statVal}>{s.xp}</span><span style={statLbl}>XP</span></div>
              <div style={stat}><span style={statVal}>{s.stars}</span><span style={statLbl}>⭐</span></div>
              <div style={stat}><span style={statVal}>{s.tokens}</span><span style={statLbl}>🪙</span></div>
              <div style={stat}><span style={statVal}>{s.streak}</span><span style={statLbl}>🔥</span></div>
              <div style={stat}><span style={statVal}>{masteryPercent(s)}%</span><span style={statLbl}>Mastery</span></div>
              <div style={stat}>
                <span style={statVal}>{s.difficulty_min ?? 1}–{s.difficulty_max ?? 5}</span>
                <span style={statLbl}>Diff</span>
              </div>
            </div>

            {/* Actions */}
            <div style={actions}>
              <button style={btnEdit} onClick={() => setEditStudent(s)}>✏️ Edit</button>
              <button style={btnPool} onClick={() => setPoolStudent(s)}>📚 Questions</button>
              <button style={btnHistory} onClick={() => setHistoryStudent(s)}>📊 History</button>
              <button style={btnReset} onClick={() => handleReset(s)}>↺ Reset</button>
              <button style={btnDel} onClick={() => handleDelete(s)}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      {students.length === 0 && (
        <p style={{ color: "#94a3b8", textAlign: "center" }}>No students yet.</p>
      )}

      {editStudent !== undefined && (
        <StudentForm
          student={editStudent}
          onSave={handleSave}
          onClose={() => setEditStudent(undefined)}
        />
      )}

      {poolStudent && (
        <StudentQuestionPool
          student={poolStudent}
          onClose={() => { setPoolStudent(null); void load(); }}
        />
      )}

      {historyStudent && (
        <StudentTestHistory
          student={historyStudent}
          onClose={() => setHistoryStudent(null)}
        />
      )}
    </div>
  );
}

const addBtn: React.CSSProperties = { padding: "0.4rem 1.1rem", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 7, fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" };
const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.75rem" };
const card: React.CSSProperties = { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" };
const cardTop: React.CSSProperties = { display: "flex", alignItems: "center", gap: "0.75rem" };
const avatar: React.CSSProperties = { width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", fontWeight: 700, color: "#fff", flexShrink: 0 };
const nameText: React.CSSProperties = { fontWeight: 700, fontSize: "1rem", color: "#1e3a5f" };
const subText: React.CSSProperties = { fontSize: "0.75rem", color: "#64748b" };
const statsRow: React.CSSProperties = { display: "flex", gap: "0.5rem", flexWrap: "wrap" };
const stat: React.CSSProperties = { display: "flex", flexDirection: "column", alignItems: "center", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "0.3rem 0.6rem", minWidth: 40 };
const statVal: React.CSSProperties = { fontWeight: 700, fontSize: "0.95rem", color: "#1e3a5f" };
const statLbl: React.CSSProperties = { fontSize: "0.65rem", color: "#94a3b8" };
const actions: React.CSSProperties = { display: "flex", gap: "0.4rem", flexWrap: "wrap" };
const btnEdit: React.CSSProperties = { padding: "3px 10px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, cursor: "pointer", fontSize: "0.78rem", color: "#1d4ed8" };
const btnPool: React.CSSProperties = { padding: "3px 10px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, cursor: "pointer", fontSize: "0.78rem", color: "#166534" };
const btnHistory: React.CSSProperties = { padding: "3px 10px", background: "#fdf4ff", border: "1px solid #e9d5ff", borderRadius: 6, cursor: "pointer", fontSize: "0.78rem", color: "#7e22ce" };
const btnReset: React.CSSProperties = { padding: "3px 10px", background: "#fefce8", border: "1px solid #fde047", borderRadius: 6, cursor: "pointer", fontSize: "0.78rem", color: "#854d0e" };
const btnDel: React.CSSProperties = { padding: "3px 9px", background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 6, cursor: "pointer", fontSize: "0.78rem", color: "#be123c", marginLeft: "auto" };
