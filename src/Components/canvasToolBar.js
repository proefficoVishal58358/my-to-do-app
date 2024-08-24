import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Toolbar = ({ onAddStickyNote, onAddTextBox, onClearAll, selectedColor, setSelectedColor, addAnnotation }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [clipBoardTextItems, setClipBoardTextItems] = useState([]);
  const [clipBoardFlag, setclipBoardFlag] = useState(false);
  const [clipBoardSmalDiv, setClipBoardSmalDiv] = useState(false);
  const [activeBtn,setActiveBtn]=useState(false);
  const colors = ['yellow', 'lightblue', 'lightgreen', 'lightcoral', 'lightpink', 'white'];

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  }; 

  const handleOpenClipBoard = () => {
    setclipBoardFlag(true);
    setActiveBtn(true);
    navigator.clipboard.readText()
    .then(text => {
      setClipBoardTextItems(prev => {
        if (!prev.includes(text)) {
          return [...prev, text];
        }
        return prev;
      });
    })
  };
const handleCloseClipBoard=()=>{
  setclipBoardFlag(false);
}


const deleteClipBoardCopyText=(idx)=>{
  console.log('idx',idx)
 const filteredClipBoard= clipBoardTextItems.filter((ele,index)=>index!=idx);
 setClipBoardTextItems(filteredClipBoard);
}
  return (
    <>
    <div style={{position: 'fixed',bottom: '20px',right: '70px',display: 'flex',flexDirection: 'column',alignItems: 'center',zIndex: 1000}}>
      {!isCollapsed && (
        <>
          <button className= "btn btn-dark btn-md text-white mb-2" onClick={onClearAll} title="Clear All">
            <i className="fas fa-trash-alt"></i>
          </button>
          <button className= "btn btn-dark btn-md mb-2" onClick={handleOpenClipBoard} title="Open Clipboard">
            <i className="fas fa-clipboard"></i>
          </button>
          {/* <button className="btn btn-secondary btn-md mb-2" onClick={onAddStickyNote} title="Add Sticky Note">
            <i className="fas fa-sticky-note"></i>
          </button> */}
          <button className= "btn btn-dark btn-md mb-2"  onClick={onAddTextBox} title="Add Text Box">
            <i className="fas fa-text-height"></i>
          </button>
          <button className= "btn btn-dark btn-md mb-2" onClick={addAnnotation} title="Annotation">
            <i className="fas fa-pen"></i>
          </button>
        </>
      )}
       <button className="btn btn-primary btn-md mb-2" onClick={toggleCollapse} title={isCollapsed ? "Expand Toolbar" : "Collapse Toolbar"} style={{ backgroundColor: `${isCollapsed?"green":"red"}`, border: 'none' }}>
        <i className={`fas ${isCollapsed ? 'fa-plus-circle' : 'fa-x'}`}></i>
      </button>
    <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
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
    {
      clipBoardFlag &&
          <div onClick={(e)=>{ setClipBoardSmalDiv(false)}} className={`clipboard-container ${clipBoardFlag ? 'visible' : ''} card card-body rounded p-0 mt-3 mx-3 overflow-y-scroll position-relative`} style={{height:"500px", width:"400px", }}>
            <button onClick={handleCloseClipBoard} className="btn btn-light border-2 rounded-2 position-fixed" style={{zIndex:"999"}}>
            <em  className="fas fa-x text-danger fa-lg" ></em>
            </button>
              {clipBoardTextItems.length > 0 && <div className="d-flex justify-content-end p-2">
                <button onClick={()=>setClipBoardTextItems([])} className="btn btn-secondary text-sm btn-sm text-white"> Clear All</button> 
              </div>}
              {clipBoardTextItems.length==0 && <div className=" mx-2 mt-5">
                <p className="text-muted text-start text-capitalize text-center text-dark fa-lg">{"No Items"}</p>
                </div>}
              {clipBoardTextItems?.map((ele,index)=>
              <>
              <div key={`clip${index}`} className={`card shadow p-0 border-bottom border-2 mx-2 ${index==0?"mt-1":"mt-1"}`}>
              <div className="d-flex p-2 justify-content-between">
                <p className="text-muted text-start text-capitalize">{ele}</p>
              </div>
              {<div className="d-flex justify-content-end mb-2">
                <button onClick={()=>deleteClipBoardCopyText(index)} className="btn btn-secondary text-sm btn-sm mx-2 text-white"> Delete</button> 
              </div>}
              </div>
              </>
                )}
              
          </div>
        }
        </>
  );
};

export default Toolbar;
