import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { format } from "date-fns";
import { Play, Pause, RotateCcw, Brain, Coffee } from "lucide-react";

const FOCUS_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60; // 5 minutes

export default function PomodoroTimer() {
  const { pomodoroStats, setPomodoroStats } = useAppContext();
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer finished
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (!isBreak) {
      // Focus session completed
      const today = format(new Date(), "yyyy-MM-dd");
      setPomodoroStats(prev => ({
        ...prev,
        totalStudyTimeMin: prev.totalStudyTimeMin + 25,
        sessionsCompleted: prev.sessionsCompleted + 1,
        dailyHistory: {
          ...prev.dailyHistory,
          [today]: (prev.dailyHistory[today] || 0) + 25
        }
      }));
      // Auto switch to break
      setIsBreak(true);
      setTimeLeft(BREAK_TIME);
      new Notification("Focus Session Complete! Time for a break.");
    } else {
      // Break completed
      setIsBreak(false);
      setTimeLeft(FOCUS_TIME);
      new Notification("Break Complete! Ready to focus?");
    }
  };

  const toggleTimer = () => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(FOCUS_TIME);
  };

  const setMode = (breakMode) => {
    setIsActive(false);
    setIsBreak(breakMode);
    setTimeLeft(breakMode ? BREAK_TIME : FOCUS_TIME);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = isBreak 
    ? ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100
    : ((FOCUS_TIME - timeLeft) / FOCUS_TIME) * 100;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Pomodoro Timer</h1>
      </header>

      <div style={styles.statsRow}>
        <Card>
          <div style={styles.statBox}>
            <span style={styles.statLabel}>Today's Focus</span>
            <span style={styles.statValue}>{pomodoroStats.dailyHistory[format(new Date(), "yyyy-MM-dd")] || 0} min</span>
          </div>
        </Card>
        <Card>
          <div style={styles.statBox}>
            <span style={styles.statLabel}>Total Focus Limit</span>
            <span style={styles.statValue}>{pomodoroStats.totalStudyTimeMin} min</span>
          </div>
        </Card>
      </div>

      <div style={styles.timerWrapper}>
        <div style={styles.toggleGroup}>
          <button 
            style={{...styles.toggleBtn, ...( !isBreak ? styles.activeToggle : {})}} 
            onClick={() => setMode(false)}
          >
            <Brain size={18} /> Focus
          </button>
          <button 
            style={{...styles.toggleBtn, ...( isBreak ? styles.activeToggleBreak : {})}} 
            onClick={() => setMode(true)}
          >
            <Coffee size={18} /> Break
          </button>
        </div>

        <div style={{
          ...styles.circleContainer,
          boxShadow: isBreak ? "0 0 40px rgba(16, 185, 129, 0.2)" : "0 0 40px var(--primary-glow)"
        }} className="glass-panel">
          
          <svg style={styles.svg} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" style={styles.circleBg} />
            <circle 
              cx="50" cy="50" r="45" 
              style={{
                ...styles.circleProgress,
                stroke: isBreak ? "var(--success-color)" : "var(--primary-color)",
                strokeDashoffset: 283 - (283 * progressPercent) / 100
              }} 
            />
          </svg>

          <div style={styles.timeDisplay}>
            {formatTime(timeLeft)}
          </div>
        </div>

        <div style={styles.controls}>
          <Button 
            onClick={toggleTimer} 
            style={{ padding: "1rem 2rem", fontSize: "1.25rem", borderRadius: "30px" }}
            variant={isActive ? "secondary" : "primary"}
          >
            {isActive ? <><Pause /> Pause</> : <><Play /> Start</>}
          </Button>
          <Button onClick={resetTimer} variant="secondary" style={{ padding: "1rem", borderRadius: "50%" }}>
            <RotateCcw size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    maxWidth: "800px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  statBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    color: "var(--text-secondary)",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  statValue: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "var(--text-primary)",
  },
  timerWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2.5rem",
    padding: "3rem",
    borderRadius: "var(--border-radius-lg)",
    backgroundColor: "var(--surface-color)",
    border: "1px solid var(--border-color)",
  },
  toggleGroup: {
    display: "flex",
    background: "var(--bg-color)",
    padding: "0.5rem",
    borderRadius: "30px",
    gap: "0.5rem",
  },
  toggleBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    border: "none",
    background: "transparent",
    color: "var(--text-secondary)",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  activeToggle: {
    background: "var(--primary-color)",
    color: "white",
    boxShadow: "0 4px 6px var(--primary-glow)",
  },
  activeToggleBreak: {
    background: "var(--success-color)",
    color: "white",
    boxShadow: "0 4px 6px rgba(16, 185, 129, 0.3)",
  },
  circleContainer: {
    position: "relative",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "box-shadow 0.5s ease",
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    transform: "rotate(-90deg)",
  },
  circleBg: {
    fill: "none",
    stroke: "var(--border-color)",
    strokeWidth: "4",
  },
  circleProgress: {
    fill: "none",
    strokeWidth: "6",
    strokeLinecap: "round",
    strokeDasharray: "283",
    transition: "stroke-dashoffset 1s linear, stroke 0.5s ease",
  },
  timeDisplay: {
    fontSize: "5rem",
    fontWeight: "700",
    fontVariantNumeric: "tabular-nums",
    zIndex: 1,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  }
};
