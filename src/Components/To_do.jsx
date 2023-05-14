import React, { useEffect } from "react";
import { useState } from "react";

export default function To_do() {
  const [task, setTask] = useState("");

  const [data, setData] = useState([]);

  const [show, setShow] = useState(false);
  const [complete, isComplete] = useState(false);

  useEffect(() => {}, []);

  const addTask = () => {
    if (task !== "") {
      // data.push(task);
      setData([...data, task]);
      setTask("");
    }
  };
  const showTask = () => {
    if (data.length > 0) {
      setShow(!show);
    }
  };

  const deleteTask = (index) => {
    let newData = [...data];
    const filterdata = newData.filter((ele, index1) => index1 != index);
    setData(filterdata);
    filterdata.length === 0 && setShow(false);
  };

  const deleteAll = () => {
    if (data.length > 0) {
      setData([]);
      setShow(false);
    }
  };
  const completeTask = () => {
    if (data.length > 0) {
      isComplete(!complete);
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
        <button onClick={showTask} type="button" className="add">
          {show ? "Hide Task" : "Show Task"}
        </button>
      </div>

      {show &&
        data?.map((ele, index) => {
          return (
            <>
              <div key={index}>
                <div className="tasks">
                  {ele}
                  <button
                    className="add"
                    onClick={() => {
                      deleteTask(index);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="add"
                    onClick={() => {
                      completeTask(index);
                    }}
                  >
                    {complete ? "InComplete" : "Complete"}
                    {}
                  </button>
                  <div className="done">
                    {complete ? "InComplete" : "Complete"}
                  </div>
                </div>
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
