import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Toolbar = ({ onAddStickyNote, onAddTextBox, onClearAll, selectedColor, setSelectedColor, addAnnotation }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const colors = ['yellow', 'lightblue', 'lightgreen', 'lightcoral', 'lightpink', 'white'];

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <div style={{position: 'fixed',bottom: '20px',right: '70px',display: 'flex',flexDirection: 'column',alignItems: 'center',zIndex: 1000}}>
      <button className="btn btn-primary btn-md mb-2" onClick={toggleCollapse} title={isCollapsed ? "Expand Toolbar" : "Collapse Toolbar"} style={{ backgroundColor: `${isCollapsed?"green":"red"}`, border: 'none' }}>
        <i className={`fas ${isCollapsed ? 'fa-plus-circle' : 'fa-x'}`}></i>
      </button>
      {!isCollapsed && (
        <>
          <button className="btn btn-danger btn-md text-white mb-2" onClick={onClearAll} title="Clear All">
            <i className="fas fa-trash-alt"></i>
          </button>
          <button className="btn btn-warning btn-md mb-2" onClick={() => navigator.clipboard.readText().then(text => alert(`Clipboard content: ${text}`))} title="Open Clipboard">
            <i className="fas fa-clipboard"></i>
          </button>
          {/* <button className="btn btn-secondary btn-md mb-2" onClick={onAddStickyNote} title="Add Sticky Note">
            <i className="fas fa-sticky-note"></i>
          </button> */}
          <button className="btn btn-info btn-md mb-2" onClick={onAddTextBox} title="Add Text Box">
            <i className="fas fa-text-height"></i>
          </button>
          <button className="btn btn-secondary btn-md mb-2" onClick={addAnnotation} title="Annotation">
            <i className="fas fa-pen"></i>
          </button>
        </>
      )}
    <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            marginTop: '10px'
          }}>

            {colors.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{
                  backgroundColor: color,
                  width: '24px',
                  height: '24px',
                  margin: '5px 5px',
                  border: selectedColor === color ? '2px solid black' : '1px solid gray',
                  cursor: 'pointer',
                  borderRadius: '50%',
                }}
                title={`Select ${color}`}
              />
            ))}
          </div>
    </div>
  );
};

export default Toolbar;
