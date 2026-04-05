import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Trash2, Edit2, GripVertical, CheckCircle2, Circle } from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Card from "../components/common/Card";

export default function TaskManager() {
  const { tasks, setTasks } = useAppContext();
  const [filter, setFilter] = useState("All");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [editingTask, setEditingTask] = useState(null);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, title: newTaskTitle, priority: newTaskPriority } : t));
      setEditingTask(null);
    } else {
      const newTask = {
        id: Date.now().toString(),
        title: newTaskTitle,
        priority: newTaskPriority,
        status: "Pending",
      };
      setTasks([...tasks, newTask]);
    }
    
    setNewTaskTitle("");
    setNewTaskPriority("Medium");
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleStatus = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === "Pending" ? "Completed" : "Pending" } : t));
  };

  const startEdit = (task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskPriority(task.priority);
  };

  const onDragEnd = (result) => {
    if (!result.destination || filter !== "All") return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  };

  const filteredTasks = tasks.filter(t => filter === "All" ? true : t.status === filter);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Task Manager</h1>
      </header>

      <Card>
        <form onSubmit={handleAddTask} style={styles.form}>
          <div style={styles.inputGroup}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder="What needs to be done?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
            </div>
            <select
              style={styles.select}
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            <Button type="submit" style={{ height: "46px" }}>
              {editingTask ? "Update" : <><Plus size={18} /> Add</>}
            </Button>
            {editingTask && (
              <Button type="button" variant="secondary" onClick={() => { setEditingTask(null); setNewTaskTitle(""); }} style={{ height: "46px" }}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div style={styles.filterGroup}>
        {["All", "Pending", "Completed"].map(f => (
          <Button
            key={f}
            variant={filter === f ? "primary" : "secondary"}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks" isDropDisabled={filter !== "All"}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={styles.taskList}>
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={filter !== "All"}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...styles.taskItem,
                        ...provided.draggableProps.style,
                        opacity: task.status === "Completed" ? 0.6 : 1,
                        boxShadow: snapshot.isDragging ? "var(--shadow-lg)" : "var(--shadow-sm)",
                      }}
                      className="glass-panel"
                    >
                      <div style={styles.taskLeft}>
                        <div {...provided.dragHandleProps} style={styles.dragHandle}>
                          <GripVertical size={20} />
                        </div>
                        <button style={styles.iconBtn} onClick={() => toggleStatus(task.id)}>
                          {task.status === "Completed" ? (
                            <CheckCircle2 color="var(--success-color)" />
                          ) : (
                            <Circle color="var(--text-muted)" />
                          )}
                        </button>
                        <span style={{
                          ...styles.taskTitle,
                          textDecoration: task.status === "Completed" ? "line-through" : "none"
                        }}>
                          {task.title}
                        </span>
                      </div>
                      <div style={styles.taskRight}>
                        <span style={{
                          ...styles.badge,
                          backgroundColor: 
                            task.priority === "High" ? "rgba(239, 68, 68, 0.1)" : 
                            task.priority === "Medium" ? "rgba(245, 158, 11, 0.1)" : "rgba(16, 185, 129, 0.1)",
                          color: 
                            task.priority === "High" ? "var(--danger-color)" : 
                            task.priority === "Medium" ? "var(--warning-color)" : "var(--success-color)",
                        }}>
                          {task.priority}
                        </span>
                        <div style={styles.actions}>
                          <button style={styles.iconBtnHover} onClick={() => startEdit(task)}>
                            <Edit2 size={16} />
                          </button>
                          <button style={{...styles.iconBtnHover, color: "var(--danger-color)"}} onClick={() => handleDelete(task.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {filteredTasks.length === 0 && (
                <div style={styles.emptyState}>No tasks found. Add a new task to get started!</div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  header: {
    marginBottom: "1rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  inputGroup: {
    display: "flex",
    gap: "1rem",
    alignItems: "flex-end",
  },
  select: {
    padding: "0 1rem",
    height: "46px", // matching input height
    borderRadius: "var(--border-radius-sm)",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--surface-color)",
    color: "var(--text-primary)",
    outline: "none",
    cursor: "pointer",
  },
  filterGroup: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    minHeight: "100px", // drop zone
  },
  taskItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem",
    transition: "background-color 0.2s, opacity 0.2s",
  },
  taskLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  dragHandle: {
    color: "var(--text-muted)",
    cursor: "grab",
    display: "flex",
    alignItems: "center",
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  taskTitle: {
    fontSize: "1rem",
    fontWeight: "500",
  },
  taskRight: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  badge: {
    padding: "0.25rem 0.5rem",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600",
  },
  actions: {
    display: "flex",
    gap: "0.5rem",
  },
  iconBtnHover: {
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    padding: "0.25rem",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    transition: "color 0.2s, background-color 0.2s",
  },
  emptyState: {
    textAlign: "center",
    padding: "3rem",
    color: "var(--text-muted)",
    fontStyle: "italic",
    border: "1px dashed var(--border-color)",
    borderRadius: "var(--border-radius-lg)",
  }
};
