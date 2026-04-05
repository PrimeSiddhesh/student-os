import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Card from "../components/common/Card";
import { CheckCircle, Circle, Trash2, Code2 } from "lucide-react";

const TOPICS = ["Array", "String", "Linked List", "Tree", "Graph", "Dynamic Programming", "Math", "Other"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function DSATracker() {
  const { dsaProblems, setDsaProblems } = useAppContext();
  const [newTitle, setNewTitle] = useState("");
  const [newTopic, setNewTopic] = useState(TOPICS[0]);
  const [newDifficulty, setNewDifficulty] = useState("Easy");
  
  const [topicFilter, setTopicFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  const handleAddProblem = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    const problem = {
      id: Date.now().toString(),
      title: newTitle,
      topic: newTopic,
      difficulty: newDifficulty,
      status: "Unsolved"
    };
    
    setDsaProblems([...dsaProblems, problem]);
    setNewTitle("");
  };

  const toggleStatus = (id) => {
    setDsaProblems(dsaProblems.map(p => 
      p.id === id ? { ...p, status: p.status === "Solved" ? "Unsolved" : "Solved" } : p
    ));
  };

  const deleteProblem = (id) => {
    setDsaProblems(dsaProblems.filter(p => p.id !== id));
  };

  // derived data for progress
  const topicStats = TOPICS.map(topic => {
    const topicProblems = dsaProblems.filter(p => p.topic === topic);
    const solved = topicProblems.filter(p => p.status === "Solved").length;
    return {
      topic,
      total: topicProblems.length,
      solved,
      percent: topicProblems.length === 0 ? 0 : Math.round((solved / topicProblems.length) * 100)
    };
  }).filter(stat => stat.total > 0);

  const filteredProblems = dsaProblems.filter(p => {
    const matchTopic = topicFilter === "All" || p.topic === topicFilter;
    const matchDifficulty = difficultyFilter === "All" || p.difficulty === difficultyFilter;
    return matchTopic && matchDifficulty;
  });

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>DSA Tracker</h1>
      </header>

      {/* Topics Progress summary */}
      {topicStats.length > 0 && (
        <Card title="Topic Progress" className="mb-4">
          <div style={styles.statsGrid}>
            {topicStats.map(stat => (
              <div key={stat.topic} style={styles.statItem}>
                <div style={styles.statHeader}>
                  <span style={styles.statTopic}>{stat.topic}</span>
                  <span style={styles.statCount}>{stat.solved}/{stat.total}</span>
                </div>
                <div style={styles.progressBarBg}>
                  <div style={{ ...styles.progressBarFill, width: `${stat.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Add New Problem Form */}
      <Card>
        <form onSubmit={handleAddProblem} style={styles.formContainer}>
          <div style={{ flex: 2 }}>
            <Input 
              placeholder="e.g. Two Sum" 
              value={newTitle} 
              onChange={e => setNewTitle(e.target.value)} 
            />
          </div>
          <select style={styles.select} value={newTopic} onChange={e => setNewTopic(e.target.value)}>
            {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select style={styles.select} value={newDifficulty} onChange={e => setNewDifficulty(e.target.value)}>
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <Button type="submit" style={{ height: "46px" }}>Add Problem</Button>
        </form>
      </Card>

      {/* Filters */}
      <div style={styles.filters}>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Topic:</span>
          <select style={styles.select} value={topicFilter} onChange={e => setTopicFilter(e.target.value)}>
            <option value="All">All Topics</option>
            {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Difficulty:</span>
          <select style={styles.select} value={difficultyFilter} onChange={e => setDifficultyFilter(e.target.value)}>
            <option value="All">All Difficulties</option>
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Problems List */}
      <div style={styles.list}>
        {filteredProblems.map(problem => (
          <div key={problem.id} className="glass-panel" style={{...styles.listItem, opacity: problem.status === "Solved" ? 0.7 : 1}}>
            <div style={styles.itemLeft}>
              <button style={styles.iconBtn} onClick={() => toggleStatus(problem.id)}>
                {problem.status === "Solved" ? <CheckCircle color="var(--success-color)" size={24}/> : <Circle color="var(--text-muted)" size={24} />}
              </button>
              <div style={styles.itemDetails}>
                <span style={{...styles.itemTitle, textDecoration: problem.status === "Solved" ? "line-through" : "none"}}>{problem.title}</span>
                <span style={styles.itemMeta}>{problem.topic}</span>
              </div>
            </div>
            <div style={styles.itemRight}>
              <span style={{
                ...styles.badge,
                backgroundColor: problem.difficulty === "Hard" ? "rgba(239,68,68,0.1)" : problem.difficulty === "Medium" ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)",
                color: problem.difficulty === "Hard" ? "var(--danger-color)" : problem.difficulty === "Medium" ? "var(--warning-color)" : "var(--success-color)",
              }}>
                {problem.difficulty}
              </span>
              <button style={styles.deleteBtn} onClick={() => deleteProblem(problem.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {filteredProblems.length === 0 && (
          <div style={styles.emptyState}>
            <Code2 size={48} style={{opacity: 0.2, marginBottom: "1rem"}} />
            <p>No problems found. Start by adding one above!</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  header: {
    marginBottom: "0.5rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  statHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  statTopic: {
    color: "var(--text-primary)",
  },
  statCount: {
    color: "var(--text-muted)",
  },
  progressBarBg: {
    height: "8px",
    backgroundColor: "var(--border-color)",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "var(--primary-color)",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  formContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    alignItems: "flex-end",
  },
  select: {
    padding: "0 1rem",
    height: "46px",
    borderRadius: "var(--border-radius-sm)",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--surface-color)",
    color: "var(--text-primary)",
    outline: "none",
    cursor: "pointer",
    minWidth: "120px",
  },
  filters: {
    display: "flex",
    gap: "1.5rem",
    marginBottom: "0.5rem",
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  filterLabel: {
    fontWeight: "500",
    color: "var(--text-secondary)",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 1.5rem",
    transition: "all 0.2s ease",
  },
  itemLeft: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  itemDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  itemTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "var(--text-primary)",
  },
  itemMeta: {
    fontSize: "0.875rem",
    color: "var(--text-secondary)",
  },
  itemRight: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  badge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "20px",
    fontSize: "0.80rem",
    fontWeight: "600",
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: "0.5rem",
    borderRadius: "50%",
    transition: "color 0.2s, background-color 0.2s",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem",
    color: "var(--text-muted)",
    border: "1px dashed var(--border-color)",
    borderRadius: "var(--border-radius-lg)",
  }
};
