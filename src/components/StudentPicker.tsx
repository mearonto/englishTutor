import { useState, useEffect } from "react";
import { studentsApi, isApiAvailable, type ApiStudent } from "../api/client";

const LAST_STUDENT_KEY = "word-quest-last-student-v1";

interface Props {
  onSelect: (student: { id: number; name: string; data: ApiStudent }) => void;
  onGuest: () => void;
}

export function StudentPicker({ onSelect, onGuest }: Props) {
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiOk, setApiOk] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  const lastStudentId = (() => {
    const raw = localStorage.getItem(LAST_STUDENT_KEY);
    return raw ? Number(raw) : null;
  })();

  useEffect(() => {
    isApiAvailable().then((ok) => {
      setApiOk(ok);
      if (!ok) { setLoading(false); return; }
      studentsApi.list()
        .then(setStudents)
        .catch(() => setApiOk(false))
        .finally(() => setLoading(false));
    });
  }, []);

  const pick = (student: ApiStudent) => {
    localStorage.setItem(LAST_STUDENT_KEY, String(student.id));
    onSelect({ id: student.id, name: student.name, data: student });
  };

  const addStudent = async () => {
    const name = newName.trim();
    if (!name) return;
    setAdding(true);
    setAddError("");
    try {
      const created = await studentsApi.create(name);
      setStudents((prev) => [...prev, created]);
      setNewName("");
    } catch {
      setAddError("Could not add student — check the server.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h1 style={styles.title}>Who's playing? 🌟</h1>

        {loading && <p style={styles.hint}>Loading...</p>}

        {!loading && !apiOk && (
          <>
            <p style={styles.warn}>
              Server not available — playing in offline mode.
            </p>
            <button style={styles.guestBtn} onClick={onGuest}>
              Continue as Guest
            </button>
          </>
        )}

        {!loading && apiOk && (
          <>
            <div style={styles.grid}>
              {students.map((s) => (
                <button
                  key={s.id}
                  style={{
                    ...styles.studentBtn,
                    ...(s.id === lastStudentId ? styles.lastBtn : {}),
                  }}
                  onClick={() => pick(s)}
                >
                  <span style={styles.avatar}>
                    {s.name.charAt(0).toUpperCase()}
                  </span>
                  <span style={styles.sName}>{s.name}</span>
                  <span style={styles.sStats}>
                    ⭐ {s.stars} &nbsp; 🔥 {s.streak}
                  </span>
                  {s.id === lastStudentId && (
                    <span style={styles.lastBadge}>Last played</span>
                  )}
                </button>
              ))}
            </div>

            <div style={styles.addRow}>
              <input
                style={styles.addInput}
                placeholder="Add new student…"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addStudent()}
                maxLength={40}
              />
              <button
                style={styles.addBtn}
                onClick={addStudent}
                disabled={adding || !newName.trim()}
              >
                {adding ? "…" : "+ Add"}
              </button>
            </div>
            {addError && <p style={styles.warn}>{addError}</p>}

            <button style={styles.guestLink} onClick={onGuest}>
              Continue as Guest (offline)
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed", inset: 0,
    background: "linear-gradient(135deg, #1e3a5f 0%, #0d6e8a 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999,
  },
  card: {
    background: "#fff", borderRadius: 20,
    padding: "2.5rem 2rem", maxWidth: 560, width: "90%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
    textAlign: "center",
  },
  title: {
    margin: "0 0 1.5rem", fontSize: "1.8rem", color: "#1e3a5f",
  },
  grid: {
    display: "flex", flexWrap: "wrap", gap: "1rem",
    justifyContent: "center", marginBottom: "1.5rem",
  },
  studentBtn: {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: "0.3rem", padding: "1rem 1.2rem",
    border: "2px solid #e2e8f0", borderRadius: 14,
    background: "#f8fafc", cursor: "pointer",
    minWidth: 120, transition: "transform 0.1s, border-color 0.1s",
    position: "relative",
  },
  lastBtn: {
    borderColor: "#3b82f6", background: "#eff6ff",
  },
  lastBadge: {
    position: "absolute", top: -10, left: "50%",
    transform: "translateX(-50%)",
    background: "#3b82f6", color: "#fff",
    fontSize: "0.65rem", padding: "1px 8px", borderRadius: 20,
    whiteSpace: "nowrap",
  },
  avatar: {
    width: 52, height: 52, borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "1.5rem", fontWeight: 700, color: "#fff",
    lineHeight: "52px", textAlign: "center",
  },
  sName: { fontWeight: 700, fontSize: "1.05rem", color: "#1e3a5f" },
  sStats: { fontSize: "0.8rem", color: "#64748b" },
  addRow: {
    display: "flex", gap: "0.5rem", marginBottom: "0.5rem",
  },
  addInput: {
    flex: 1, padding: "0.5rem 0.75rem",
    border: "1.5px solid #cbd5e1", borderRadius: 8,
    fontSize: "0.95rem",
  },
  addBtn: {
    padding: "0.5rem 1rem", background: "#3b82f6", color: "#fff",
    border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600,
  },
  guestBtn: {
    padding: "0.75rem 2rem", background: "#64748b", color: "#fff",
    border: "none", borderRadius: 10, cursor: "pointer",
    fontSize: "1rem", fontWeight: 600, marginTop: "1rem",
  },
  guestLink: {
    marginTop: "0.75rem", background: "none", border: "none",
    color: "#94a3b8", cursor: "pointer", fontSize: "0.85rem",
    textDecoration: "underline",
  },
  hint: { color: "#64748b" },
  warn: { color: "#dc2626", fontSize: "0.9rem", margin: "0.5rem 0" },
};
