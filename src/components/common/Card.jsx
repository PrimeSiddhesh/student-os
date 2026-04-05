export default function Card({ title, children, actions, className = "" }) {
  return (
    <div className={`glass-panel ${className}`} style={styles.card}>
      {(title || actions) && (
        <div style={styles.header}>
          {title && <h3 style={styles.title}>{title}</h3>}
          {actions && <div style={styles.actions}>{actions}</div>}
        </div>
      )}
      <div style={styles.content}>{children}</div>
    </div>
  );
}

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    padding: "1.5rem",
    height: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "var(--text-primary)",
  },
  actions: {
    display: "flex",
    gap: "0.5rem",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
};
