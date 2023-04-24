import React from "react";
import { useState } from "react";

export default function To_do() {
  const [task, setTask] = useState("");

  const [data, setData] = useState([]);

  const [todo, addTodo] = useState(data);
  // const [dlt, setDlt] = useState([]);
  // const [dlt, setDlt] = useState([]);
  // const [dlt, setDlt] = useState([]);

  const addTask = () => {
    if (task !== "") {
      data.push(task);
      setData([...data]);
    }
  };
  const show = () => {
    if (data) addTodo([...data]);
  };

  // const dltTask = (index) => {};

  const deleteAll = () => {
    if (todo.length > 0) {
      addTodo([]);
      setData([]);
    }
  };
  return (
    <div className="container">
      <div className="form">
        <input
          onChange={(e) => setTask(e.target.value)}
          type="text"
          className="input"
          placeholder="Enter your task"
          value={task}
          required
        />
        <button onClick={addTask} type="button" className="add">
          Add Task
        </button>
        <button onClick={show} type="button" className="add">
          Show Task
        </button>
      </div>
      {todo?.map((ele, index) => {
        return (
          <>
            <div key={index}>
              <div className="tasks">{ele}</div>
            </div>
          </>
        );
      })}
      {/* try to commit */}
      <div onClick={deleteAll} className="delete-all">
        Delete all
      </div>
    </div>
  );
}
