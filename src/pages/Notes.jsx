import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import ReactMarkdown from "react-markdown";
import { Plus, Trash2, Edit2, Check, FileText } from "lucide-react";

export default function Notes() {
  const { notes, setNotes } = useAppContext();
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const activeNote = notes.find(n => n.id === activeNoteId);

  const createNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "# Start typing your thoughts...",
      updatedAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    startEditing(newNote);
  };

  const startEditing = (note) => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(true);
  };

  const saveNote = () => {
    setNotes(notes.map(n => 
      n.id === activeNoteId 
        ? { ...n, title: editTitle || "Untitled Note", content: editContent, updatedAt: new Date().toISOString() } 
        : n
    ));
    setIsEditing(false);
  };

  const deleteNote = (id, e) => {
    if (e) e.stopPropagation();
    setNotes(notes.filter(n => n.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
      setIsEditing(false);
    }
  };

  const truncate = (str, n) => {
    return (str.length > n) ? str.substr(0, n-1) + '...' : str;
  };

  return (
    <div style={styles.container}>
      {/* Sidebar for Notes List */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>My Notes</h2>
          <Button onClick={createNote} style={{ padding: "0.5rem" }}><Plus size={18} /></Button>
        </div>
        
        <div style={styles.noteList}>
          {notes.map(note => (
            <div 
              key={note.id} 
              style={{
                ...styles.noteItem, 
                backgroundColor: activeNoteId === note.id ? "var(--surface-color)" : "transparent",
                borderLeft: activeNoteId === note.id ? "3px solid var(--primary-color)" : "3px solid transparent",
              }}
              onClick={() => {
                setActiveNoteId(note.id);
                setIsEditing(false);
              }}
            >
              <div style={styles.noteItemContent}>
                <h4 style={styles.noteTitle}>{note.title}</h4>
                <p style={styles.notePreview}>{truncate(note.content.replace(/#/g, ""), 40)}</p>
              </div>
              <button style={styles.iconBtnHover} onClick={(e) => deleteNote(note.id, e)}>
                <Trash2 size={16} color="var(--danger-color)" />
              </button>
            </div>
          ))}

          {notes.length === 0 && (
            <div style={styles.emptySidebar}>
              No notes yet. Create one!
            </div>
          )}
        </div>
      </div>

      {/* Main Editor/Viewer Area */}
      <div style={styles.mainArea}>
        {activeNote ? (
          <Card className="full-height-card" style={styles.cardContainer}>
            {isEditing ? (
              <div style={styles.editorContainer}>
                <div style={styles.editorHeader}>
                  <input 
                    style={styles.titleInput} 
                    value={editTitle} 
                    onChange={e => setEditTitle(e.target.value)}
                    placeholder="Note Title" 
                  />
                  <Button onClick={saveNote}><Check size={18} /> Save</Button>
                </div>
                <textarea 
                  style={styles.textArea} 
                  value={editContent} 
                  onChange={e => setEditContent(e.target.value)}
                  placeholder="Supports Markdown..."
                />
              </div>
            ) : (
              <div style={styles.viewerContainer}>
                <div style={styles.viewerHeader}>
                  <h1 style={styles.viewerTitle}>{activeNote.title}</h1>
                  <Button variant="secondary" onClick={() => startEditing(activeNote)}><Edit2 size={18} /> Edit</Button>
                </div>
                <div className="markdown-body" style={styles.markdownBody}>
                  <ReactMarkdown>{activeNote.content}</ReactMarkdown>
                </div>
              </div>
            )}
          </Card>
        ) : (
          <div style={styles.emptyState}>
            <FileText size={48} style={{ opacity: 0.2, marginBottom: "1rem" }} />
            <p>Select a note or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "calc(100vh - 120px)", // Assuming roughly 120px taken by padding and topbar
    gap: "1.5rem",
  },
  sidebar: {
    width: "300px",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "var(--surface-color)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--border-radius-lg)",
    overflow: "hidden",
  },
  sidebarHeader: {
    padding: "1rem",
    borderBottom: "1px solid var(--border-color)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "var(--bg-color)",
  },
  sidebarTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
  },
  noteList: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  noteItem: {
    padding: "1rem",
    borderBottom: "1px solid var(--border-color)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  noteItemContent: {
    flex: 1,
    overflow: "hidden",
  },
  noteTitle: {
    fontSize: "0.95rem",
    fontWeight: "600",
    marginBottom: "0.25rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  notePreview: {
    fontSize: "0.8rem",
    color: "var(--text-secondary)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  iconBtnHover: {
    background: "none",
    border: "none",
    padding: "0.25rem",
    cursor: "pointer",
    opacity: 0,
    transition: "opacity 0.2s",
  },
  emptySidebar: {
    padding: "2rem",
    textAlign: "center",
    color: "var(--text-muted)",
    fontSize: "0.9rem",
  },
  mainArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  editorContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    gap: "1rem",
  },
  editorHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
  },
  titleInput: {
    flex: 1,
    fontSize: "1.5rem",
    fontWeight: "700",
    padding: "0.5rem 0",
    border: "none",
    borderBottom: "1px dashed var(--border-color)",
    backgroundColor: "transparent",
    color: "var(--text-primary)",
    outline: "none",
  },
  textArea: {
    flex: 1,
    width: "100%",
    padding: "1rem",
    borderRadius: "var(--border-radius-sm)",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-color)",
    color: "var(--text-primary)",
    fontFamily: "monospace",
    fontSize: "0.95rem",
    outline: "none",
    resize: "none",
  },
  viewerContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    gap: "1rem",
  },
  viewerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "1rem",
    borderBottom: "1px solid var(--border-color)",
  },
  viewerTitle: {
    fontSize: "2rem",
    fontWeight: "700",
  },
  markdownBody: {
    flex: 1,
    overflowY: "auto",
    lineHeight: "1.6",
    fontSize: "1rem",
    whiteSpace: "pre-wrap",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text-muted)",
    backgroundColor: "var(--surface-color)",
    border: "1px dashed var(--border-color)",
    borderRadius: "var(--border-radius-lg)",
  }
};
