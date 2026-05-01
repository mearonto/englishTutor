import { useState, useEffect, useCallback } from "react";
import { testSessionsApi, type ApiTestSession, type ApiStudent } from "../../api/client";

interface Props {
  student: ApiStudent;
  onClose: () => void;
}

function formatDate(ts: string): string {
  return new Date(ts).toLocaleString();
}

function formatDuration(start: string, end?: string): string {
  if (!end) return "—";
  const secs = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 1000);
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export function StudentTestHistory({ student, onClose }: Props) {
  const [sessions, setSessions] = useState<ApiTestSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await testSessionsApi.listForStudent(student.id, 100);
      setSessions(result.sessions);
    } catch {
      setError("Could not load test history. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [student.id]);

  useEffect(() => { void load(); }, [load]);

  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        <div style={hdr}>
          <div>
            <h3 style={{ margin: 0 }}>{student.name}'s Test History</h3>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.8rem", color: "#64748b" }}>
              {loading ? "Loading…" : `${sessions.length} completed test${sessions.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button style={closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={listWrap}>
          {loading && <p style={{ color: "#94a3b8", padding: "1.5rem", textAlign: "center" }}>Loading…</p>}
          {error && <p style={{ color: "#dc2626", padding: "1.5rem", textAlign: "center" }}>{error}</p>}
          {!loading && !error && sessions.length === 0 && (
            <p style={{ color: "#94a3b8", padding: "1.5rem", textAlign: "center" }}>No test sessions recorded yet.</p>
          )}
          {!loading && sessions.map((s) => {
            const pct = s.total ? Math.round(((s.score ?? 0) / s.total) * 100) : 0;
            const pass = pct >= 70;
            return (
              <div key={s.id} style={row}>
                <div style={rowTop}>
                  <span style={{ fontSize: "0.82rem", color: "#64748b" }}>{formatDate(s.finished_at ?? s.started_at)}</span>
                  <span style={{ ...scoreBadge, background: pass ? "#dcfce7" : "#fee2e2", color: pass ? "#166534" : "#991b1b" }}>
                    {pct}% ({s.score}/{s.total})
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{formatDuration(s.started_at, s.finished_at)}</span>
                  {s.subject && (
                    <span style={subjectPill}>{s.subject}</span>
                  )}
                </div>
                {(s.wrong_words ?? []).length > 0 && (
                  <div style={missed}>
                    Missed: {(s.wrong_words ?? []).join(", ")}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={footer}>
          <button style={closeAction} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 };
const modal: React.CSSProperties = { background: "#fff", borderRadius: 16, width: "min(640px, 96vw)", maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" };
const hdr: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "1rem 1.25rem", borderBottom: "1px solid #e2e8f0" };
const listWrap: React.CSSProperties = { overflowY: "auto", flex: 1 };
const footer: React.CSSProperties = { display: "flex", justifyContent: "flex-end", padding: "0.75rem 1.25rem", borderTop: "1px solid #e2e8f0" };
const row: React.CSSProperties = { padding: "0.65rem 1.25rem", borderBottom: "1px solid #f1f5f9" };
const rowTop: React.CSSProperties = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.6rem" };
const scoreBadge: React.CSSProperties = { fontWeight: 700, fontSize: "0.82rem", padding: "1px 8px", borderRadius: 12 };
const subjectPill: React.CSSProperties = { fontSize: "0.72rem", background: "#e0f2fe", color: "#0369a1", padding: "1px 7px", borderRadius: 12, fontWeight: 600 };
const missed: React.CSSProperties = { fontSize: "0.75rem", color: "#dc2626", marginTop: "0.3rem" };
const closeBtn: React.CSSProperties = { background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748b" };
const closeAction: React.CSSProperties = { padding: "0.45rem 1.4rem", background: "#e2e8f0", border: "none", borderRadius: 7, cursor: "pointer" };
