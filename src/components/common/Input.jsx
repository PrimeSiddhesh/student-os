export default function Input({ label, type = "text", value, onChange, placeholder, ...props }) {
  return (
    <div style={styles.container}>
      {label && <label style={styles.label}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={styles.input}
        {...props}
      />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    width: "100%",
  },
  label: {
    fontSize: "0.875rem",
    color: "var(--text-secondary)",
    fontWeight: "500",
  },
  input: {
    padding: "0.75rem 1rem",
    borderRadius: "var(--border-radius-sm)",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--surface-color)",
    color: "var(--text-primary)",
    outline: "none",
    transition: "border-color 0.2s ease",
    fontFamily: "inherit",
  },
};
