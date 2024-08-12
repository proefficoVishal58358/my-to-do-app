import React,{useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';

const Toolbar = ({ onAddStickyNote, onAddTextBox,onClearAll ,selectedColor,setSelectedColor,addAnnotation}) => {
    const colors = ['yellow', 'lightblue', 'lightgreen', 'lightcoral', 'lightpink',"white"];
    return (
      <div  style={{ marginBottom: '10px',marginTop:"20px" }}>
        <button  className="btn btn-warning btn-sm"  onClick={() => navigator.clipboard.readText().then(text => 
          alert(`Clipboard content: ${text}`)
          )}>
          Open Clipboard
        </button>
        <button className="btn btn-secondary btn-sm" onClick={onAddStickyNote}>Add Sticky Note</button>
        <button  className="btn btn-info btn-sm" onClick={onAddTextBox}>Add Text Box</button>
        <button  className="btn btn-danger btn-sm text-white" onClick={onClearAll} style={{ color: 'red' }}>
        Clear All
      </button>
        <button  className="btn btn-secondary btn-sm  " onClick={addAnnotation} style={{ color: 'white' }}>
        Annotation
        </button>
      <div style={{ marginTop: '10px' }}>
        <span>Select Pen Color: </span>
        {colors.map(color => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            style={{
              backgroundColor: color,
              width: '24px',
              height: '24px',
              margin: '0 5px',
              border: selectedColor === color ? '2px solid black' : '1px solid gray',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
      </div>
    );
  };
  export default Toolbar;