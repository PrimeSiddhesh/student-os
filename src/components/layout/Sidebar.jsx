import { NavLink } from "react-router-dom";
import { LayoutDashboard, CheckSquare, Code2, Timer, StickyNote, BarChart3 } from "lucide-react";

export default function Sidebar() {
  const links = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/tasks", icon: <CheckSquare size={20} />, label: "Tasks" },
    { to: "/dsa", icon: <Code2 size={20} />, label: "DSA Tracker" },
    { to: "/timer", icon: <Timer size={20} />, label: "Timer" },
    { to: "/notes", icon: <StickyNote size={20} />, label: "Notes" },
    { to: "/analytics", icon: <BarChart3 size={20} />, label: "Analytics" },
  ];

  return (
    <div style={styles.sidebar} className="glass-panel">
      <div style={styles.logo}>🎓 Student OS</div>
      <nav style={styles.nav}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              ...styles.link,
              backgroundColor: isActive ? "var(--primary-glow)" : "transparent",
              color: isActive ? "var(--primary-color)" : "var(--text-secondary)",
              fontWeight: isActive ? "600" : "500",
            })}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    display: "flex",
    flexDirection: "column",
    padding: "1.5rem",
    borderLeft: "none",
    borderTop: "none",
    borderBottom: "none",
    borderRadius: "0",
    borderRight: "1px solid var(--border-color)",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "var(--primary-color)",
    marginBottom: "2rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    borderRadius: "var(--border-radius-md)",
    transition: "all 0.2s ease",
  },
};
