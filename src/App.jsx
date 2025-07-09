import React, { useState } from 'react';
import './App.css';
export default function toDo() {
  const [task, settask] = useState([]);
  const [title, settitle] = useState("");
  const [prior, setprior] = useState("");
  const [editIndex, seteditIndex] = useState(null);
  const [edittitle, setedittitle] = useState("");
  const [editprior, seteditprior] = useState("");

  // const[bool,setbool]=useState('false');
   // const [deltask,setdeltask]=useState("");
    
    // const addtask=()=>{
    //   const id=task.length+1;
    //   settask([...task,{id,title,prior}])
    //   settitle("");
    //   setprior("")
    // };
  
    // const delTask=(id)=>{
    //   const updatetask=task.filter(t=>t.id!==id);
    //   settask(updatetask);
    //   setdeltask("");
    // };

  const addtask = () => {
    const newtask = [...task, { title, prior }];
    const taskswithid = newtask.map((t, index) => ({
      ...t,
      id: index + 1,
    }));
    settask(taskswithid);
    settitle("");
    setprior("");
  };

  const delTask = (id) => {
    const updatedtask = task.filter(t => t.id !== id);
    const taskswithid = updatedtask.map((t, index) => ({
      ...t,
      id: index + 1,
    }));
    settask(taskswithid);
  };

  const startEdit = (id) => {
    const toupdate = task.find(t => t.id === id);
    seteditIndex(id);
    setedittitle(toupdate.title);
    seteditprior(toupdate.prior);
  };

  const updateTask = () => {
    const updatedtask = task.map((t) =>
      t.id === editIndex ? { ...t, title: edittitle, prior: editprior } : t
    );
    settask(updatedtask);
    seteditIndex(null);
    setedittitle("");
    seteditprior("");
  };

  return (
    <div className="todo-container">
      <h1>Todo Lists</h1>
      <input value={title} onChange={(e) => settitle(e.target.value)} placeholder="enter task" />
      <input value={prior} onChange={(e) => setprior(e.target.value)} placeholder=" enter priority of task" />
      <button onClick={addtask}>
        Add task
      </button>
      <h1>Tasks</h1>
      <ul>
        {task.map(task => (
          <li key={task.id} className="task-item">
            {task.id}. {task.title} Priority: {task.prior}
            <button onClick={() => delTask(task.id)}>delete Task</button>
            <button onClick={() => startEdit(task.id)}>Edit Task</button>
          </li>
        ))}
      </ul>

      {editIndex !== null && (
        <div className="edit-section">
          <h2>Edit Task #{editIndex}</h2>
          <input value={edittitle} onChange={(e) => setedittitle(e.target.value)} placeholder="Edit title" />
          <input value={editprior} onChange={(e) => seteditprior(e.target.value)} placeholder="Edit priority" />
          <button onClick={updateTask}>Save Update</button>
        </div>
      )}
    </div>
  );
}
