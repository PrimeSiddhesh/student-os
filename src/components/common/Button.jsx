export default function Button({ children, onClick, variant = "primary", icon, className = "", ...props }) {
  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    borderRadius: "var(--border-radius-sm)",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "none",
    outline: "none",
  };

  const variants = {
    primary: {
      backgroundColor: "var(--primary-color)",
      color: "#ffffff",
      boxShadow: "0 2px 4px var(--primary-glow)",
    },
    secondary: {
      backgroundColor: "transparent",
      color: "var(--text-primary)",
      border: "1px solid var(--border-color)",
    },
    danger: {
      backgroundColor: "transparent",
      color: "var(--danger-color)",
      border: "1px solid var(--danger-color)",
    },
  };

  return (
    <button
      style={{ ...baseStyle, ...variants[variant] }}
      onClick={onClick}
      className={className}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
