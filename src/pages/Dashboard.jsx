import { useAppContext } from "../context/AppContext";
import Card from "../components/common/Card";
import { CheckCircle, Clock, ListTodo, Target } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const QUOTES = [
  "The secret of getting ahead is getting started. - Mark Twain",
  "It always seems impossible until it's done. - Nelson Mandela",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "The future depends on what you do today. - Mahatma Gandhi",
];

export default function Dashboard() {
  const { tasks, pomodoroStats } = useAppContext();
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Pick a random quote on mount
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Today's focus time
  const today = format(new Date(), "yyyy-MM-dd");
  const focusTimeToday = pomodoroStats.dailyHistory?.[today] || 0;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome back! 👋</h1>
        <p style={styles.quote}>{quote}</p>
      </header>

      <div style={styles.grid}>
        <Card>
          <div style={styles.statCard}>
            <div style={{ ...styles.iconWrapper, background: "var(--primary-glow)", color: "var(--primary-color)" }}>
              <ListTodo size={24} />
            </div>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Total Tasks</span>
              <span style={styles.statValue}>{totalTasks}</span>
            </div>
          </div>
        </Card>

        <Card>
          <div style={styles.statCard}>
            <div style={{ ...styles.iconWrapper, background: "rgba(16, 185, 129, 0.2)", color: "var(--success-color)" }}>
              <CheckCircle size={24} />
            </div>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Completed</span>
              <span style={styles.statValue}>{completedTasks}</span>
            </div>
          </div>
        </Card>

        <Card>
          <div style={styles.statCard}>
            <div style={{ ...styles.iconWrapper, background: "rgba(245, 158, 11, 0.2)", color: "var(--warning-color)" }}>
              <Clock size={24} />
            </div>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Focus Time Today</span>
              <span style={styles.statValue}>{focusTimeToday} min</span>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Daily Progress" className="mt-8">
        <div style={styles.progressContainer}>
          <div style={styles.progressHeader}>
            <span style={styles.progressText}>Task Completion Rate</span>
            <span style={styles.progressText}>{progressPercent}%</span>
          </div>
          <div style={styles.progressBarBg}>
            <div
              style={{
                ...styles.progressBarFill,
                width: `${progressPercent}%`,
              }}
            />
          </div>
          {progressPercent === 100 && totalTasks > 0 && (
            <p style={styles.successMessage}>🎉 You accomplished all your tasks for today!</p>
          )}
        </div>
      </Card>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
  },
  quote: {
    color: "var(--text-secondary)",
    fontStyle: "italic",
    fontSize: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  iconWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statInfo: {
    display: "flex",
    flexDirection: "column",
  },
  statLabel: {
    fontSize: "0.875rem",
    color: "var(--text-secondary)",
  },
  statValue: {
    fontSize: "1.5rem",
    fontWeight: "700",
  },
  progressContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
  },
  progressText: {
    fontWeight: "500",
  },
  progressBarBg: {
    height: "12px",
    width: "100%",
    backgroundColor: "var(--border-color)",
    borderRadius: "6px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "var(--primary-color)",
    borderRadius: "6px",
    transition: "width 0.5s ease-out",
  },
  successMessage: {
    color: "var(--success-color)",
    fontWeight: "500",
    textAlign: "center",
    marginTop: "1rem",
  },
};
