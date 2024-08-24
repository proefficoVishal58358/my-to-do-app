import React, { useRef, useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import "bootstrap/dist/css/bootstrap.css";
import Toolbar from "./canvasToolBar";
import MinMaxBtnCanva from "./MinMaxBtnCanva";
import ConfirmationModal from "./Modal";

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
 

  const handleShowModal = (id) => {
    setShowModal(true);
    setlinkCardTextMapId(id)

  };
  const handleConfirm = () => {
    props.setMappedId(linkCardTextMapId);
    let viewer = props.viewerIns;
    viewer.annotation.setAnnotationMode('Ink');

  };


  useEffect(() => {
    if(props?.annotaionText){
        addPdfTextToCanva(props?.annotaionText, props?.mappedId)
    }else if(props.rightLinkMappedId) {
      addPdfTextToCanva(props?.annotaionText, props?.mappedId, props.rightLinkMappedId)
    }
  }, [props?.annotaionText]);


  // useEffect(() => {
  //   props?.droppedText &&
  //     addPdfTextToCanva(props?.droppedText);
  // }, [props?.droppedText]);

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
  
  const addPdfTextToCanva = (text, mappedId, rightArrowLinkId) => {
    if (text !== null && text?.trim() !== "" && mappedId && rightArrowLinkId === undefined) {
      const newNotePdfExtracting = {
        id: pdfHighLightedText.length + 1,
        linkingId: mappedId,
        text,
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        color: textBoxColor,
      };
      setPdFHighLightedText(prevState => [...prevState, newNotePdfExtracting]);
    } else if (rightArrowLinkId !== undefined) {
      setPdFHighLightedText(prevState =>
        prevState.map(ele =>
          ele.linkingId === mappedId
            ? { ...ele, rightLinkId: rightArrowLinkId }
            : ele
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

  const addTextBox = () => {
    const newTextbox = {
      id: textboxes.length + 1,
      text: "",
      x: 50,
      y: 50,
      width: 200,
      height: 200,
      color: "violet",
    };
    setTextboxes([...textboxes, newTextbox]);
  };

  const handleTextboxChange = (id, text) => {
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
    setNotes([]);
    setTextboxes([]);
    setPdFHighLightedText([]);
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    props.setMappedId("");
    props.setAnnoDict([]);
  };

  const goToAnnoPageLinkage = (e, linkingId) => {
    e.stopPropagation();
    if (linkingId) {
      const pageNumberArr = props?.annoDict?.filter(
        (ele) => linkingId == ele.pageLinkedId
      );
      if (pageNumberArr) {
        props.viewerIns.navigation.goToPage(pageNumberArr[0].extrPageIndex + 1);
      }
    } else {
      props.viewerIns.annotationModule.selectAnnotation(props.mappedId);
    }
  };
  const linkOrGotoAnnotatedpage = (e, rightLinkId,pdfExtractedMappedId) => {
    console.log(rightLinkId,'rightLinkId')
    e.stopPropagation();
    if (rightLinkId) {
      const pageNumberArr = props?.annoDict?.filter(
        (ele) => rightLinkId == ele.rightLinkId
      );
      if (pageNumberArr) {
        props.viewerIns.navigation.goToPage(pageNumberArr[0].rightLinkpageIndex + 1);
      }
    } else {
      console.log('pdfExtractedMappedId',pdfExtractedMappedId)
      handleShowModal(pdfExtractedMappedId)
    }
   
  };

  const maxCanvaWidthFunc =()=>{
    setMinMaxCanvaWidth("100%");
  }

  const minCanvaWidthFunc =()=>{
    setMinMaxCanvaWidth("40%");
  }

  return (
    <div style={{background: "azure" }}>
      {/* <MinMaxBtnCanva 
      maxCanvaWidthFunc={maxCanvaWidthFunc}
      minCanvaWidthFunc={minCanvaWidthFunc}
      /> */}
      <Toolbar
        onAddStickyNote={addStickyNote}
        onAddTextBox={addTextBox}
        onClearAll={clearAll}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />
      <div style={{ position: "relative",overflowX:"scroll" }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          onMouseLeave={finishDrawing}
          style={{ zIndex: 1 }}
          // onDropCapture={props.canvasOnDrop}
          // onDragOver={props.onDragOver}
        />
        {notes.map((note, index) => (
          <Rnd
            key={note.id}
            size={{ width: note.width, height: note.height ,margin:"auto"}}
            position={{ x: note.x, y: note.y}}
            onDragStop={(e, d) => handleDragStop("note", note.id, d.x, d.y)}
            onResizeStop={(e, direction, ref, delta, position) => {
              handleResizeStop("note",note.id,ref.offsetWidth,ref.offsetHeight);
            }}
            style={{zIndex: 2,backgroundColor: selectedColor,cursor: "move",}}
          >
            <div
              className="card card-body shadow"
              onChange={(e) =>
                handleDragChange("note", note.id, e.target.value)
              }
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: note.color,
                border: "none",
                resize: "none",
                outline: "none",
              }}
            >
              {note.text}
            </div>
          </Rnd>
        ))}
        {pdfHighLightedText.map((pdfHighLightedText, index) => (
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
              backgroundColor: "",
              cursor: "move",
            }}
          > 
            <div className="input-group input-group-sm">
              <em title={`${pdfHighLightedText.id}`} className="text-primary input-group-text" onClick={(e) =>goToAnnoPageLinkage(e, pdfHighLightedText.linkingId)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" cursor={"pointer"}  viewBox="0 0 16 16">
                  <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                </svg>
              </em>
              <input  className="form-control form-control-sm text-white font-weight-bold text-capitalize" style={{ background: " rgb(254,166,154)" ,fontSize:"11px"}}/>
              <em title={`${pdfHighLightedText.id}`} className="text-primary input-group-text"  onClick={(e)=> linkOrGotoAnnotatedpage(e, pdfHighLightedText.rightLinkId,pdfHighLightedText.linkingId)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" cursor="pointer" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m-3.5 7.5a.5.5 0 0 1 0-1H10.293l-2.147-2.146a.5.5 0 0 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 1 1-.708-.708L10.293 8z" />
              </svg>
              </em>
            </div>
            <div className="card card-body rounded-3 p-0" onChange={(e) => handleDragChange("pdfExtractedText", pdfHighLightedText.id, e.target.value)} style={{width: "100%", height: "80%", backgroundColor: "#fff", border: "none", resize: "none", outline: "none", overflow: "hidden",fontSize:"16px"}}>
              {pdfHighLightedText.text}
            </div>
          </Rnd>
        ))}
        {textboxes.map((textbox, index) => (
          <Rnd
            key={textbox.id}
            size={{ width: textbox.width, height: textbox.height}}
            position={{ x: textbox.x , y: textbox.y  }}
            onDragStop={(e, d) => handleTextboxDragStop(textbox.id, d.x, d.y)}
            onResizeStop={(e, direction, ref, delta, position) => {
              handleTextboxResizeStop(
                textbox.id,
                ref.offsetWidth,
                ref.offsetHeight
              );
            }}
            style={{
              zIndex: 2,
              cursor: "move",
              // backgroundColor: textbox.color,
            }}
          >
            <div className="card card-body rounded-3 p-1" style={{height:"100%",width:"100%"}}>
            <textarea placeholder="Write something here..."
              value={textbox.text}
              onChange={(e) => handleTextboxChange(textbox.id, e.target.value)}
              style={{
                backgroundColor: "#fff",
                border: "none",
                resize: "none",
                outline: "none",
                color:"black",
                overflow: "hidden",
              }}
            />
            </div>
          </Rnd>
        ))}
      </div>
      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default Canvas;
