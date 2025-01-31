import React, { useRef, useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import "bootstrap/dist/css/bootstrap.css";
import Toolbar from "./canvasToolBar";
import ConfirmationModal from "./Modal";
import ColorPickerComp from "./colorPickerComp";
const Canvas = (props) => {
  const pagePdfIndex = props.pagesIndexes;
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [notes, setNotes] = useState([]);
  const [pdfHighLightedText, setPdFHighLightedText] = useState([]);
  const [textboxes, setTextboxes] = useState([]);
  const [selectedColor, setSelectedColor] = useState("yellow");
  const [clipboardColor, setClipboardColor] = useState("green");
  const [stickiNoteColor, setStickyNoteColor] = useState("white");
  const [textBoxColor, setTextBoxColor] = useState("pink");
  const [textData, setTextData] = useState(null);
  const [minMaxCanvaWidth, setMinMaxCanvaWidth] = useState("40%");
  const [showModal, setShowModal] = useState(false);
  const [linkCardTextMapId, setlinkCardTextMapId] = useState(null); 
  const [showPicker, setShowPicker] = useState(false);
  const [colorPickerIndex, setColorPickerIndex] = useState(false);
  const [cardBoxtype, setCardBoxtype] = useState('pdfTextCard');
  const [color,setColor]=useState('pink')

  const handleChooseColor = (e,index,type) => {
  setShowPicker(!showPicker);
  setColorPickerIndex(index);
  setCardBoxtype(type);
};
  const handleChangeComplete = (color) => {
    setColor(color.hex);
    if(cardBoxtype=="pdfTextCard"){
      setPdFHighLightedText(prevState =>
        prevState.map((ele,index) =>
          index === colorPickerIndex ? { ...ele,color:color.hex,textColor:color}: ele
        )
      );
    }else if(cardBoxtype=="textBoxCard"){
      setTextboxes(prevState =>
        prevState.map((ele,index) =>
         (index ==colorPickerIndex)? { ...ele,color:color.hex,textColor:color}: ele
        )
      );
    }
    // setShowPicker(false);
  };

  const handleShowModal = (id) => {
    setShowModal(true);
    if(id){
      setlinkCardTextMapId(id)
    }else{
      setlinkCardTextMapId(undefined)
    }
  };

  const handleConfirm = () => {
    if(linkCardTextMapId){
      props.setMappedId(linkCardTextMapId);
      props.setFlagForTextbox(false);
    }else{
      props.setFlagForTextbox(true);
    }
    let viewer = props.viewerIns;
    viewer.annotation.setAnnotationMode('Ink');
  };

  useEffect(() => {
    if(props?.annotaionText){
        addPdfTextToCanva(props?.annotaionText, props?.mappedId, props.rightLinkMappedId, props.argIndexes)
    }else if(props.rightLinkMappedId) {
      addPdfTextToCanva(props?.annotaionText, props?.mappedId, props.rightLinkMappedId, props.argIndexes)
    }
  }, [props?.annotaionText,props.rightLinkMappedId]);


  useEffect(()=>{
  if(props.textBoxLinkId){
    addTextBox(props.textBoxLinkId,props.annoDictTextBox,props.argIndexes)
  }
  },[props.textBoxLinkId]);


  useEffect(() => {
  const canvas = canvasRef.current;
  canvas.width = window.innerWidth * 2;
  canvas.height = window.innerHeight * 2;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  const context = canvas.getContext("2d");
  context.scale(2, 2);
  context.lineCap = "round";
  context.strokeStyle = "black";
  context.lineWidth = 5;
  contextRef.current = context;
  context.strokeStyle = "#ff0000";
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = selectedColor;
    }
  }, [selectedColor]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const addStickyNote = () => {
    const text = prompt("Enter the text for the new sticky note:");
    if (text !== null && text.trim() !== "") {
      const newNote = {
        id: notes.length + 1,
        text,
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        color: "red",
      };
      setNotes([...notes, newNote]);
    }
  };
  
  const addPdfTextToCanva = (text, mappedId, rightArrowLinkId, argIndex) => {
    if (text !== null && text?.trim() !== "" && mappedId && rightArrowLinkId === undefined) {
      const newNotePdfExtracting = {
        id: pdfHighLightedText.length + 1,
        argIndex:argIndex,
        linkingId: mappedId,
        text,
        x: 50,
        y: ((pdfHighLightedText.length*200)+10),
        width: 200,
        height: 200,
        color: textBoxColor,
      };
      setPdFHighLightedText(prevState =>{
              if(!prevState.includes(text)){
               return [...prevState, newNotePdfExtracting]
              }
      });
    } else if (rightArrowLinkId !== undefined) {
      setPdFHighLightedText(prevState =>
        prevState.map(ele =>
          ele.linkingId === mappedId
            ? { ...ele, rightLinkId: rightArrowLinkId , rightArgIndex:argIndex}: ele
        )
      );
    }
  };

  const addTextBox = (linkId,textBoxDict,textBoxPageIndex) => {
    if(textBoxPageIndex==undefined){
      const newTextbox = {
        id: textboxes.length + 1,
        text:textboxes.text,
        x: (250),
        y: ((textboxes.length*200)+10),
        width: 200,
        height: 200,
        color: "#fff",
      };
      setTextboxes(prev=>{
        if(!prev.includes(textboxes.text)){
          return [...prev, newTextbox]
        }
      });
    }else if(linkId){
      setTextboxes(prevState =>
        prevState.map(ele =>
         (linkId ==ele.textBoxlinkId || !ele.textBoxlinkId )? { ...ele, textBoxlinkId:linkId, pageIndex:textBoxPageIndex}: ele
        )
      );
    }
  };

  const handleDragChange = (type, id, text) => {
    if (type == "note") {
      setNotes(
        notes.map((note) => (note.id === id ? { ...note, text } : note))
      );
    } else {
      setPdFHighLightedText(
        pdfHighLightedText.map((text) =>
          text.id === id ? { ...text, text } : text
        )
      );
    }
  };

  const handleDragStop = (type, id, x, y) => {
    if (type == "note") {
      setNotes(
        notes.map((note) => (note.id === id ? { ...note, x, y } : note))
      );
    } else {
      setPdFHighLightedText(
        pdfHighLightedText.map((text) =>
          text.id === id ? { ...text, x, y } : text
        )
      );
    }
  };

  const handleResizeStop = (type, id, width, height) => {
    if (type == "note") {
      setNotes(
        notes.map((note) =>
          note.id === id ? { ...note, width, height } : note
        )
      );
    } else {
      setPdFHighLightedText(
        pdfHighLightedText.map((text) =>
          text.id === id ? { ...text, width, height } : text
        )
      );
    }
  };

 
  const handleTextboxChange = (id, text,e) => {
    e.stopPropagation();
    setTextboxes(
      textboxes.map((textbox) =>
        textbox.id === id ? { ...textbox, text } : textbox
      )
    );
  };

  const handleTextboxDragStop = (id, x, y) => {
    setTextboxes(
      textboxes.map((textbox) =>
        textbox.id === id ? { ...textbox, x, y } : textbox
      )
    );
  };

  const handleTextboxResizeStop = (id, width, height) => {
    setTextboxes(
      textboxes.map((textbox) =>
        textbox.id === id ? { ...textbox, width, height } : textbox
      )
    );
  };

  const clearAll = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setNotes([]);
    setTextboxes([]);
    setPdFHighLightedText([]);
    props.setMappedId("");
    props.setTextBoxLinkId(undefined);
    props.setRightLinkMappedId(undefined);
    props.setAnnoDict([]);
    props.setAnnoDictTextBox([]);
    props.setFlagForTextbox(false);
    props.viewerIns.undo();
  };

 
  const goToAnnoPageLinkage = (e, linkingId,linkagePageIndex) => {
    e.stopPropagation();
    if (linkingId) {
        props.viewerIns.navigation.goToPage(linkagePageIndex + 1);
    } else {
      props.viewerIns.annotationModule.selectAnnotation(props.mappedId);
    }
  };
  const linkOrGotoAnnotatedpage = (e, rightLinkId, pdfExtractedMappedId, linkagePageIndex) => {
    e.stopPropagation();
    if (rightLinkId) {
        props.viewerIns.navigation.goToPage(linkagePageIndex + 1);
    } else {
      handleShowModal(pdfExtractedMappedId)
    }
   
  };
  const goToAnnoPageLinkageOfTextBox = (e,pageIndex) => {
    e.stopPropagation();
    if(pageIndex){
      props.viewerIns.navigation.goToPage(pageIndex + 1);
    }else{
      handleShowModal();
    }
  };
  return (
    <div style={{background: "azure" }}>
      <Toolbar 
      // onAddStickyNote={addStickyNote}
       onAddTextBox={addTextBox} 
       onClearAll={clearAll} 
       selectedColor={selectedColor} 
       setSelectedColor={setSelectedColor}
       />
      <ColorPickerComp 
            handleChangeComplete={handleChangeComplete}
            showPicker={showPicker}
            color={color}
            />
      <div style={{ position: "relative",overflowX:"scroll" }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          onMouseLeave={finishDrawing}
          style={{ zIndex: 1 }}
          onClick={ ()=>setShowPicker(false)}
        />
        {pdfHighLightedText?.map((pdfHighLightedText, index) => (
          <Rnd
          key={pdfHighLightedText.id}
            size={{width: pdfHighLightedText.width,height: pdfHighLightedText.height}}
            position={{x: pdfHighLightedText.x, y: pdfHighLightedText.y}}
            onDragStop={(e, d) =>
              handleDragStop("pdfExtractedText",pdfHighLightedText.id,d.x,d.y)}
              onResizeStop={(e, direction, ref, delta, position) => {
              handleResizeStop("pdfExtractedText",pdfHighLightedText.id,ref.offsetWidth,ref.offsetHeight);
            }}
            style={{
              zIndex: 2,
              cursor: "move",
            }}
          > 
            <div  className="card card-body rounded-3 p-0" onChange={(e) => handleDragChange("pdfExtractedText", pdfHighLightedText.id, e.target.value)} style={{width: "95%", height: "100%", backgroundColor: `${pdfHighLightedText.color}`, border: "none", resize: "none", outline: "none", overflow: "hidden",fontSize:"16px"}}>
            <div className="input-group input-group-sm">
              <em title={`To Page no. ${pdfHighLightedText.argIndex+1}`} className="text-primary input-group-text" onClick={(e) =>goToAnnoPageLinkage(e, pdfHighLightedText.linkingId,pdfHighLightedText.argIndex)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" cursor={"pointer"}  viewBox="0 0 16 16">
                  <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                </svg>
              <p className="badge badge-sm bg-success m-1">{pdfHighLightedText.argIndex+1}</p>
              </em>
              <input  className="form-control form-control-sm text-white font-weight-bold text-capitalize" style={{ background: " rgb(254,166,154)" ,fontSize:"11px"}}/>
             
              <em style={{cursor:"pointer"}} className="fa-solid fa-paintbrush text-lg input-group-text" onClick={(e)=> handleChooseColor(e,index,'pdfTextCard')} ></em>
            </div>
            <span className="">
              {pdfHighLightedText.text}
            </span>
            <div className="d-flex justify-content-end fixed-bottom">
              <div className="input-group input-group-sm ">
              <em title={`To Page no. ${pdfHighLightedText.rightArgIndex?pdfHighLightedText.rightArgIndex+1:"No Link"}`} className="text-primary input-group-text"  onClick={(e)=> linkOrGotoAnnotatedpage(e, pdfHighLightedText.rightLinkId,pdfHighLightedText.linkingId,pdfHighLightedText.rightArgIndex)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" cursor="pointer" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m-3.5 7.5a.5.5 0 0 1 0-1H10.293l-2.147-2.146a.5.5 0 0 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 1 1-.708-.708L10.293 8z" />
              </svg>
              <p className="badge badge-sm bg-secondary m-1">{pdfHighLightedText.rightArgIndex?pdfHighLightedText.rightArgIndex+1:""}</p>
              </em>
              </div>
            </div>
            </div>
          </Rnd>
            
        ))}
        {textboxes?.map((ele, index) => (
          <Rnd
            key={ele.id}
            size={{ width: ele.width, height: ele.height}}
            position={{ x: ele.x , y: ele.y  }}
            onDragStop={(e, d) => handleTextboxDragStop(ele.id, d.x, d.y)}
            onResizeStop={(e, direction, ref, delta, position) => {
              handleTextboxResizeStop(ele.id,ref.offsetWidth,ref.offsetHeight);
            }}
            style={{
              zIndex: 2,
              cursor: "move",
            }}
          >
            <div  className="card card-body rounded-3 p-1" style={{height:"100%", width:"95%", backgroundColor: `${ele.color}`}}>
            <div className="input-group input-group-sm">
              <em title={`To Page no. ${ele.pageIndex?ele.pageIndex+1:"No Linkage"}`} className="text-primary input-group-text" onClick={(e) =>goToAnnoPageLinkageOfTextBox(e, ele.pageIndex)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" cursor={"pointer"}  viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
              </svg>
              <p className={`badge badge-sm ${ele.pageIndex?'bg-success':'bg-warning'} m-1`}>{ele.pageIndex ? ele.pageIndex+1 :""}</p>
              </em>
              <em style={{cursor:"pointer"}} className="fa-solid fa-paintbrush text-lg input-group-text" onClick={(e)=> handleChooseColor(e,index,'textBoxCard')}></em>
            </div>               
            <textarea placeholder="Write something here..."
              value={ele.text}
              onChange={(e) => handleTextboxChange(ele.id, e.target.value,e)}
              style={{backgroundColor: `${ele.color}`,border: "none",resize: "none",outline: "none", color:`${ele.textColor}`,overflow: "hidden",height:"50%"}}
            />
          </div>               
          </Rnd>
        ))}
     
      </div>
      <ConfirmationModal show={showModal} onHide={() => setShowModal(false)} onConfirm={handleConfirm}/>
    </div>
  );
};

export default Canvas;
