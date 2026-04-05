import { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage("student-os-tasks", []);
  const [dsaProblems, setDsaProblems] = useLocalStorage("student-os-dsa", []);
  const [pomodoroStats, setPomodoroStats] = useLocalStorage("student-os-pomodoro", {
    totalStudyTimeMin: 0,
    sessionsCompleted: 0,
    dailyHistory: {}, // { "2024-05-12": 120 }
  });
  const [notes, setNotes] = useLocalStorage("student-os-notes", []);

  // Sync / derived data helpers could go here

  return (
    <AppContext.Provider
      value={{
        tasks,
        setTasks,
        dsaProblems,
        setDsaProblems,
        pomodoroStats,
        setPomodoroStats,
        notes,
        setNotes,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
