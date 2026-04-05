import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AppProvider } from "./context/AppContext";

// Layout
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";

// Pages
import { useNavigate } from "react-router-dom";
import { useKeyPress } from "./hooks/useKeyPress";

// Pages
import Dashboard from "./pages/Dashboard";
import TaskManager from "./pages/TaskManager";
import DSATracker from "./pages/DSATracker";
import PomodoroTimer from "./pages/PomodoroTimer";
import Notes from "./pages/Notes";
import Analytics from "./pages/Analytics";

function MainAppContent() {
  const navigate = useNavigate();

  useKeyPress("n", () => navigate("/notes"));
  useKeyPress("t", () => navigate("/tasks"));
  useKeyPress("d", () => navigate("/"));
  useKeyPress("p", () => navigate("/timer"));

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="page-wrapper animate-fade-in">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskManager />} />
            <Route path="/dsa" element={<DSATracker />} />
            <Route path="/timer" element={<PomodoroTimer />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <MainAppContent />
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
