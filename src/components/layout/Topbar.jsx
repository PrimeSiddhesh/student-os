import { useTheme } from "../../context/ThemeContext";
import { Moon, Sun, Download, Keyboard } from "lucide-react";

export default function Topbar() {
  const { theme, toggleTheme } = useTheme();

  const handleExportData = () => {
    const data = {
      tasks: JSON.parse(localStorage.getItem('student-os-tasks') || '[]'),
      dsa: JSON.parse(localStorage.getItem('student-os-dsa') || '[]'),
      pomodoro: JSON.parse(localStorage.getItem('student-os-pomodoro') || '{}'),
      notes: JSON.parse(localStorage.getItem('student-os-notes') || '[]'),
      theme: JSON.parse(localStorage.getItem('student-os-theme') || '"dark"'),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `student-os-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <header style={styles.header}>
      <div style={styles.leftSide}>
        <div style={styles.shortcutHint} title="Global Shortcuts">
          <Keyboard size={16} /> <span>Shortcuts: 'N' for New Note, 'T' for Tasks</span>
        </div>
      </div>
      <div style={styles.actions}>
        <button style={styles.actionBtn} onClick={handleExportData} title="Export Data as JSON">
          <Download size={20} />
        </button>
        <button style={styles.actionBtn} onClick={toggleTheme} title="Toggle Dark Mode">
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  leftSide: {
    display: "flex",
    alignItems: "center",
  },
  shortcutHint: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "var(--text-muted)",
    fontSize: "0.875rem",
    backgroundColor: "var(--surface-color)",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    border: "1px solid var(--border-color)",
  },
  actions: {
    display: "flex",
    gap: "1rem",
  },
  actionBtn: {
    background: "var(--surface-color)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    cursor: "pointer",
    padding: "0.5rem",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    boxShadow: "var(--shadow-sm)",
  },
};
