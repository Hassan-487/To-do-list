
import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./App.css";

export default function ToDo() {
  const [task, settask] = useState(() => {
    const savetask = localStorage.getItem("tsk");
    if (!savetask) return [];
    return JSON.parse(savetask);
  });

  const [title, settitle] = useState("");
  const [prior, setprior] = useState("");
  const [titleError, setTitleError] = useState("");
  const [priorError, setPriorError] = useState("");

  const [state, setState] = useState("activetask");

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    localStorage.setItem("tsk", JSON.stringify(task));
    console.log("Task updated in localStorage");
  }, [task]);

  const addtask = () => {
    let hasError = false;

    if (title.trim() === "") {
      setTitleError("Title is required");
      hasError = true;
    } else {
      setTitleError("");
    }

    if (prior.trim() === "") {
      setPriorError("Priority is required");
      hasError = true;
    } else {
      setPriorError("");
    }

    if (hasError) return;

    const newtask = [
      ...task,
      { title, prior, completed: false, isEditing: false, tempTitle: title, tempPrior: prior },
    ];
    const taskswithid = newtask.map((t, index) => ({
      ...t,
      id: index + 1,
    }));
    settask(taskswithid);
    settitle("");
    setprior("");
  };

  const confirmDeleteTask = useCallback((id) => {
    setDeleteId(id);
    setShowConfirm(true);
  }, []);

  const handleConfirmDelete = () => {
    settask((prev) =>
      prev
        .filter((t) => t.id !== deleteId)
        .map((t, index) => ({
          ...t,
          id: index + 1,
        }))
    );
    setShowConfirm(false);
    setDeleteId(null);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  const startEdit = useCallback((id) => {
    settask((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isEditing: true } : t
      )
    );
  }, []);

  const updateTask = useCallback((id) => {
    settask((prev) => {
      const taskToUpdate = prev.find(t => t.id === id);
      if (!taskToUpdate) return prev;

      const hasChanges = taskToUpdate.title !== taskToUpdate.tempTitle ||
        taskToUpdate.prior !== taskToUpdate.tempPrior ||
        taskToUpdate.isEditing;

      if (!hasChanges) return prev;

      return prev.map((t) =>
        t.id === id ? { ...t, title: t.tempTitle, prior: t.tempPrior, isEditing: false } : t
      );
    });
  }, []);

  const toggleComplete = useCallback((id) => {
    settask((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  }, []);

  const onChangeTempTitle = useCallback((id, value) => {
    settask((prev) =>
      prev.map((t) => (t.id === id ? { ...t, tempTitle: value } : t))
    );
  }, []);

  const onChangeTempPrior = useCallback((id, value) => {
    settask((prev) =>
      prev.map((t) => (t.id === id ? { ...t, tempPrior: value } : t))
    );
  }, []);

  const cancelEdit = useCallback((id) => {
    settask((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isEditing: false, tempTitle: t.title, tempPrior: t.prior } : t
      )
    );
  }, []);

  const getpriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "priority-high";
      case "Medium":
        return "priority-medium";
      case "Low":
        return "priority-low";
      default:
        return "";
    }
  };

  const priorityOrder = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const sortByPriority = (tasks) => {
    return [...tasks].sort((a, b) => {
      const priorityCompare =
        (priorityOrder[b.prior] || 0) - (priorityOrder[a.prior] || 0);
      if (priorityCompare !== 0) return priorityCompare;
      return a.title.localeCompare(b.title);
    });
  };

  const activeTasks = useMemo(() =>
    sortByPriority(task.filter((t) => !t.completed)),
    [task]
  );

  const completedTasks = useMemo(() =>
    sortByPriority(task.filter((t) => t.completed)),
    [task]
  );

  return (
    <div className="todo-container">
      <h1>Todo App</h1>
     <div className="form-row">
  <input
    value={title}
    onChange={(e) => {
    settitle(e.target.value);
    if (e.target.value.trim() !== "") {
      setTitleError("");  
    }
  }}
    placeholder="Enter task" 
  />
  <select value={prior} onChange={(e) => {
  setprior(e.target.value);
  if (e.target.value.trim() !== "") {
    setPriorError(""); 
  }
}}>
    <option value="">Select Priority</option>
    <option value="High">High</option>
    <option value="Medium">Medium</option>
    <option value="Low">Low</option>
  </select>
  <button onClick={addtask}>Add task</button>
</div>

<div className="error-row">
  <p className="er">{titleError}</p>
  <p className="err">{priorError}</p>
</div>

      {showConfirm && (
        <div className="pop">
          <div className="popup">
            <p>Are you sure you want to delete this task?</p>
            <div className="popup-buttons">
              <button onClick={handleConfirmDelete}>Yes</button>
              <button onClick={handleCancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}

      <div className="toggle-bar">
        <button
          className={state === "activetask" ? "active" : ""}
          onClick={() => setState("activetask")}
        >
          Active Tasks
        </button>
        <button
          className={state === "completedtask" ? "active" : ""}
          onClick={() => setState("completedtask")}
        >
          Completed Tasks
        </button>
        <div className={`slider ${state}`}></div>
      </div>

      <div className="task-sections">
        {state === "activetask" && (
          <div className="task-list">
            <h2>Active Tasks</h2>
            <ul>
              {activeTasks.map((task) => (
                <li key={task.id} className="task-item">
                  <div className="task-left">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                    />
                    {task.isEditing ? (
                      <>
                        <input
                          value={task.tempTitle}
                          onChange={(e) =>
                            onChangeTempTitle(task.id, e.target.value)
                          }
                          placeholder="Edit title"
                        />
                        <select
                          value={task.tempPrior}
                          onChange={(e) =>
                            onChangeTempPrior(task.id, e.target.value)
                          }
                        >
                          <option value="">Select Priority</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                        <button onClick={() => updateTask(task.id)}>Save</button>
                        <button onClick={() => cancelEdit(task.id)}>Cancel</button>
                      </>
                    ) : (
                      <span>
                        {task.id}. {task.title}
                        <span className={getpriorityClass(task.prior)}>
                          {" "}
                          {task.prior}
                        </span>
                      </span>
                    )}
                  </div>
                  {!task.isEditing && (
                    <div className="task-right">
                      <button onClick={() => confirmDeleteTask(task.id)}>Delete</button>
                      <button onClick={() => startEdit(task.id)}>Edit</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {state === "completedtask" && (
          <div className="completed-list">
            <h2>Completed Tasks</h2>
            <ul>
              {completedTasks.map((task) => (
                <li key={task.id} className="task-item">
                  <div className="task-left">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                    />
                    {task.id}. {task.title}
                    <span className={getpriorityClass(task.prior)}>
                      {" "}
                      {task.prior}
                    </span>
                  </div>
                  <div className="task-right">
                    <button onClick={() => confirmDeleteTask(task.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
