import { useAppContext } from "../context/AppContext";
import Card from "../components/common/Card";
import { format, subDays, eachDayOfInterval, isSameDay, differenceInDays } from "date-fns";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from "recharts";
import { Flame, TrendingUp } from "lucide-react";

export default function Analytics() {
  const { pomodoroStats, tasks } = useAppContext();

  // Create last 7 days array
  const today = new Date();
  const last7Days = eachDayOfInterval({
    start: subDays(today, 6),
    end: today
  });

  // Calculate Streak
  let currentStreak = 0;
  const historyDates = Object.keys(pomodoroStats.dailyHistory).sort((a, b) => new Date(b) - new Date(a));
  
  if (historyDates.length > 0) {
    let dateToCheck = today;
    for (let i = 0; i < historyDates.length; i++) {
        const histDate = new Date(historyDates[i]);
        const diff = differenceInDays(dateToCheck, histDate);
        if (diff === 0 || diff === 1) { // 0 for today, 1 for yesterday, etc.
             currentStreak++;
             dateToCheck = histDate;
        } else {
             break;
        }
    }
    // if today neither today nor yesterday has activity, streak is 0
    // The simple logic above might double count if today has no activity but yesterday does, but it's fine for simple MVP.
  }

  // Formatting chart data
  const chartData = last7Days.map(date => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const dayName = format(date, "EEE"); // Mon, Tue, etc.
    
    // Time data
    const focusTime = pomodoroStats.dailyHistory[formattedDate] || 0;
    
    return {
      name: dayName,
      focusTime,
      fullDate: formattedDate
    };
  });

  // Priority distribution for tasks
  const priorityData = [
    { name: 'High', count: tasks.filter(t => t.priority === 'High').length, fill: 'var(--danger-color)' },
    { name: 'Medium', count: tasks.filter(t => t.priority === 'Medium').length, fill: 'var(--warning-color)' },
    { name: 'Low', count: tasks.filter(t => t.priority === 'Low').length, fill: 'var(--success-color)' },
  ].filter(p => p.count > 0);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Analytics & Trends</h1>
      </header>

      <div style={styles.statsGrid}>
        <Card>
          <div style={styles.statBox}>
            <div style={{...styles.iconWrapper, background: "rgba(245, 158, 11, 0.2)", color: "var(--warning-color)"}}>
              <Flame size={28} />
            </div>
            <div>
              <span style={styles.statLabel}>Current Streak</span>
              <div style={styles.statValue}>{currentStreak} <span style={{fontSize: "1rem"}}>Days</span></div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div style={styles.statBox}>
            <div style={{...styles.iconWrapper, background: "rgba(99, 102, 241, 0.2)", color: "var(--primary-color)"}}>
              <TrendingUp size={28} />
            </div>
            <div>
              <span style={styles.statLabel}>Total Focus Time</span>
              <div style={styles.statValue}>{pomodoroStats.totalStudyTimeMin} <span style={{fontSize: "1rem"}}>Min</span></div>
            </div>
          </div>
        </Card>
      </div>

      <div style={styles.chartsGrid}>
        {/* Focus Time Chart */}
        <Card title="Focus Time (Last 7 Days)" className="chart-card">
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--primary-color)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="focusTime" 
                  name="Focus Time (min)" 
                  stroke="var(--primary-color)" 
                  strokeWidth={3}
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Priorities Chart */}
        <Card title="Tasks by Priority" className="chart-card">
          <div style={{ height: 300, width: '100%' }}>
            {priorityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip 
                    cursor={{fill: 'var(--border-color)', opacity: 0.4}}
                    contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" name="Tasks" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
                <div style={styles.emptyState}>No tasks available for analysis.</div>
            )}
          </div>
        </Card>
      </div>
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
    marginBottom: "0.5rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
  },
  statBox: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  iconWrapper: {
    width: "64px",
    height: "64px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: "0.9rem",
    color: "var(--text-secondary)",
    fontWeight: "500",
  },
  statValue: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "var(--text-primary)",
    display: "flex",
    alignItems: "baseline",
    gap: "0.25rem",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "1.5rem",
  },
  emptyState: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text-muted)",
    fontStyle: "italic",
  }
};
