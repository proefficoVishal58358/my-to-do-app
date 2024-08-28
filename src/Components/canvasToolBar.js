import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ClipBoard from "./clipBoard";
const Toolbar = ({ onAddStickyNote, onAddTextBox, onClearAll, selectedColor, setSelectedColor, freeHandSketch,fadePen,fadeBoxBtn }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [clipBoardTextItems, setClipBoardTextItems] = useState([]);
  const [clipBoardFlag, setclipBoardFlag] = useState(false);
  const [clipBoardSmalDiv, setClipBoardSmalDiv] = useState(false);
  const colors = ['yellow', 'lightblue', 'lightgreen', 'lightcoral', 'lightpink', 'white'];

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  }; 

  const handleOpenClipBoard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        setclipBoardFlag(true);
        setClipBoardTextItems(prev => {
          if (!prev.includes(text)) {
            return [...prev, text];
          }
          return prev;
        });
      } else {
        console.log("Clipboard is empty");
      }
    } catch (error) {
      console.error("Failed to read clipboard contents:", error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'c') {
        handleOpenClipBoard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); 

const handleCloseClipBoard=()=>{
  setclipBoardFlag(false);
}

const deleteClipBoardCopyText=(idx)=>{
 const filteredClipBoard= clipBoardTextItems.filter((ele,index)=>index!=idx);
 setClipBoardTextItems(filteredClipBoard);
}



  return (
    <>
    <div style={{position: 'fixed',bottom: '20px',right: '70px',display: 'flex',flexDirection: 'column',alignItems: 'center',zIndex: 1000}}>
      {!isCollapsed && (
        <>
          <button className= "btn btn-secondary btn-md text-white mb-2" onClick={onClearAll} title="Clear All">
            <i className="fas fa-trash-alt"></i>
          </button>
          {/* <button className= "btn btn-dark btn-md mb-2" onClick={handleOpenClipBoard} title="Open Clipboard">
            <i className="fas fa-clipboard"></i>
          </button> */}
          {/* <button className="btn btn-secondary btn-md mb-2" onClick={onAddStickyNote} title="Add Sticky Note">
            <i className="fas fa-sticky-note"></i>
          </button> */}
          <button className={`btn btn-${fadeBoxBtn ? 'dark' : 'secondary' } btn-md mb-2`}  onClick={onAddTextBox} title="Add Text Box">
            <i className="fas fa-text-height"></i>
          </button>
          {/* <button className= {`btn btn-${fadePen ? 'dark' : 'secondary' } btn-md mb-2`} onClick={freeHandSketch} title="Annotation">
            <i className="fas fa-pen"></i>
          </button> */}
        </>
      )}
       <button className="btn btn-primary btn-md mb-2" onClick={toggleCollapse} title={isCollapsed ? "Expand Toolbar" : "Collapse Toolbar"} style={{ backgroundColor: `${isCollapsed?"green":"red"}`, border: 'none' }}>
        <i className={`fas ${isCollapsed ? 'fa-plus-circle' : 'fa-x'}`}></i>
      </button>
    {/* <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {colors.map((color,index) => (
              <button key={`btn_${index}`}
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
          </div> */}
      </div>

        <ClipBoard 
        clipBoardFlag={clipBoardFlag}
        setClipBoardSmalDiv={setClipBoardSmalDiv}
        handleCloseClipBoard={handleCloseClipBoard}
        setClipBoardTextItems={setClipBoardTextItems}
        clipBoardTextItems={clipBoardTextItems}
        deleteClipBoardCopyText={deleteClipBoardCopyText}
        />
        </>
  );
};

export default Toolbar;
