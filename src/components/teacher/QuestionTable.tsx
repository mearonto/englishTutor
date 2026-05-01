import { useState, useEffect, useCallback } from "react";
import { questionsApi, type ApiQuestion } from "../../api/client";
import { DifficultyBadge } from "./DifficultyBadge";
import { QuestionForm } from "./QuestionForm";
import { ImportQuestions } from "./ImportQuestions";

const PAGE_SIZE = 50;

const SUBJECTS = ["", "astronomy", "canada", "math-kangaroo", "english"];
const SUBJECT_LABELS: Record<string, string> = {
  "": "All Subjects", astronomy: "🔭 Astronomy", canada: "🍁 Canada",
  "math-kangaroo": "🦘 Math Kangaroo", english: "📖 English",
};

export function QuestionTable() {
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  // Filters
  const [subject, setSubject] = useState("");
  const [search, setSearch] = useState("");
  const [diffMin, setDiffMin] = useState(1);
  const [diffMax, setDiffMax] = useState(5);
  const [showInactive, setShowInactive] = useState(false);

  // Modals
  const [editQuestion, setEditQuestion] = useState<ApiQuestion | null | undefined>(undefined);
  const [showImport, setShowImport] = useState(false);

  const fetchQuestions = useCallback(async (pg = page) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        limit: String(PAGE_SIZE),
        offset: String(pg * PAGE_SIZE),
        difficulty_min: String(diffMin),
        difficulty_max: String(diffMax),
        active: showInactive ? "false" : "true",
      };
      if (subject) params.subject = subject;
      if (search.trim()) params.search = search.trim();

      const { questions: qs, total: t } = await questionsApi.list(params);
      setQuestions(qs);
      setTotal(t);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, subject, search, diffMin, diffMax, showInactive]);

  useEffect(() => { void fetchQuestions(0); setPage(0); }, [subject, diffMin, diffMax, showInactive]);

  // Search debounce
  useEffect(() => {
    const t = setTimeout(() => { void fetchQuestions(0); setPage(0); }, 350);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { void fetchQuestions(page); }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (q: ApiQuestion) => {
    if (!confirm(`Delete "${q.word}"? (soft delete — can be restored)`)) return;
    await questionsApi.remove(q.id);
    void fetchQuestions();
  };

  const handleSave = () => {
    setEditQuestion(undefined);
    void fetchQuestions();
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <select style={styles.sel} value={subject} onChange={(e) => setSubject(e.target.value)}>
          {SUBJECTS.map((s) => <option key={s} value={s}>{SUBJECT_LABELS[s]}</option>)}
        </select>
        <input style={styles.searchBox} placeholder="Search word or prompt…"
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <label style={styles.diffLabel}>
          Diff {diffMin}–{diffMax}
          <input type="range" min={1} max={5} value={diffMin}
            onChange={(e) => setDiffMin(Math.min(Number(e.target.value), diffMax))}
            style={{ width: 70, accentColor: "#3b82f6" }} />
          <input type="range" min={1} max={5} value={diffMax}
            onChange={(e) => setDiffMax(Math.max(Number(e.target.value), diffMin))}
            style={{ width: 70, accentColor: "#3b82f6" }} />
        </label>
        <label style={{ fontSize: "0.82rem", display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
          <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} />
          Show inactive
        </label>
        <button style={styles.importBtn} onClick={() => setShowImport(true)}>⬆ Import</button>
        <button style={styles.addBtn} onClick={() => setEditQuestion(null)}>+ Add</button>
      </div>

      {/* Stats */}
      <div style={{ fontSize: "0.82rem", color: "#64748b" }}>
        {loading ? "Loading…" : `${total} question${total !== 1 ? "s" : ""} found`}
      </div>

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Subject</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Word</th>
              <th style={styles.th}>Prompt</th>
              <th style={styles.th}>Diff</th>
              <th style={styles.th}>Active</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id} style={!q.active ? styles.inactiveRow : {}}>
                <td style={styles.td}>{q.id}</td>
                <td style={styles.td}><span style={styles.subjectPill}>{q.subject}</span></td>
                <td style={styles.td}><code style={{ fontSize: "0.75rem" }}>{q.type}</code></td>
                <td style={styles.td}><strong>{q.word}</strong></td>
                <td style={{ ...styles.td, maxWidth: 260 }}>
                  <span title={q.prompt} style={styles.truncate}>{q.prompt}</span>
                </td>
                <td style={styles.td}><DifficultyBadge level={q.difficulty} size="sm" /></td>
                <td style={styles.td}>
                  <span style={{ color: q.active ? "#16a34a" : "#dc2626", fontWeight: 700 }}>
                    {q.active ? "✓" : "✗"}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button style={styles.editBtn} onClick={() => setEditQuestion(q)}>Edit</button>
                    <button style={styles.delBtn} onClick={() => handleDelete(q)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {questions.length === 0 && !loading && (
          <p style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}>No questions found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button disabled={page === 0} onClick={() => setPage(0)}>«</button>
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>‹</button>
          <span style={{ fontSize: "0.85rem" }}>Page {page + 1} / {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>›</button>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)}>»</button>
        </div>
      )}

      {/* Modals */}
      {editQuestion !== undefined && (
        <QuestionForm
          question={editQuestion}
          onSave={handleSave}
          onClose={() => setEditQuestion(undefined)}
        />
      )}
      {showImport && (
        <ImportQuestions
          onImported={() => { setShowImport(false); void fetchQuestions(); }}
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  toolbar: {
    display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center",
  },
  sel: {
    padding: "5px 8px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: "0.85rem",
  },
  searchBox: {
    flex: 1, minWidth: 160, padding: "5px 10px",
    border: "1px solid #cbd5e1", borderRadius: 6, fontSize: "0.85rem",
  },
  diffLabel: {
    display: "flex", alignItems: "center", gap: 4,
    fontSize: "0.82rem", color: "#475569", whiteSpace: "nowrap",
  },
  importBtn: {
    padding: "5px 12px", background: "#f1f5f9",
    border: "1px solid #cbd5e1", borderRadius: 6, cursor: "pointer", fontSize: "0.85rem",
  },
  addBtn: {
    padding: "5px 14px", background: "#3b82f6", color: "#fff",
    border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: "0.85rem",
  },
  tableWrap: {
    overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: 10,
  },
  table: {
    width: "100%", borderCollapse: "collapse", fontSize: "0.82rem",
  },
  th: {
    background: "#f8fafc", padding: "8px 10px", textAlign: "left",
    fontWeight: 700, color: "#475569", borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "7px 10px", borderBottom: "1px solid #f1f5f9", verticalAlign: "top",
  },
  inactiveRow: { opacity: 0.5 },
  subjectPill: {
    background: "#e0f2fe", color: "#0369a1",
    padding: "1px 7px", borderRadius: 12, fontSize: "0.72rem", fontWeight: 600,
  },
  truncate: {
    display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  editBtn: {
    padding: "2px 10px", background: "#eff6ff", border: "1px solid #bfdbfe",
    borderRadius: 5, cursor: "pointer", fontSize: "0.78rem", color: "#1d4ed8",
  },
  delBtn: {
    padding: "2px 10px", background: "#fff1f2", border: "1px solid #fecdd3",
    borderRadius: 5, cursor: "pointer", fontSize: "0.78rem", color: "#be123c",
  },
  pagination: {
    display: "flex", gap: "0.5rem", alignItems: "center", justifyContent: "center",
  },
};
