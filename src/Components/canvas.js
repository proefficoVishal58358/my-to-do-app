import React, { useRef, useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import 'bootstrap/dist/css/bootstrap.css';
import Toolbar from "./canvasToolBar";

const Canvas = (props) => {
  console.log(props?.annotaionType,'annotaionType')
  console.log(props?.annotationData,'annotationData')
  console.log(props?.annotaionText,'annotaionText')  
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

  useEffect(() => {
    props?.annotaionText && addPdfTextToCanva(props?.annotaionText)
  }, [props?.annotaionText])
  
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
    context.strokeStyle = '#ff0000'; // Stroke color
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
        color:"red"
      };
      setNotes([...notes, newNote]);
    }
  };
  const addPdfTextToCanva = (text) => {
    if (text !== null && text.trim() !== "") {
      const newNotePdfExtracting = {
        id: pdfHighLightedText.length + 1,
        text,
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        color:textBoxColor
      };
      setPdFHighLightedText([...pdfHighLightedText, newNotePdfExtracting]);
    }
  };

  const handleChange = (type,id, text) => {
    if(type=="note"){
      setNotes(notes.map((note) => (note.id === id ? { ...note, text } : note)));
    }else{
      setPdFHighLightedText(pdfHighLightedText.map((text)=>(text.id === id ? { ...text, text } : text)))
    }
  };

  const handleDragStop = (type, id, x, y) => {
    if(type=="note"){
    setNotes(notes.map((note) => (note.id === id ? { ...note, x, y } : note)));
    }else{
      setPdFHighLightedText(pdfHighLightedText.map((text)=>(text.id === id ? { ...text, x, y } : text)))
    }
  };

  const handleResizeStop = (type,id, width, height) => {
    if(type=="note"){
    setNotes(notes.map((note) => (note.id === id ? { ...note, width, height } : note)));
    }else{
      setPdFHighLightedText(pdfHighLightedText.map((text)=>(text.id === id ? { ...text, width, height  } : text)))
    }
  };

  const addTextBox = () => {
    const newTextbox = {
      id: textboxes.length + 1,
      text: "",
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      color:"violet"
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
  };

  return (
    <div style={{ width: "40%", height: "100%" }}>
      <Toolbar
        onAddStickyNote={addStickyNote}
        onAddTextBox={addTextBox}
        onClearAll={clearAll}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />
      <div style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          onMouseLeave={finishDrawing}
          style={{zIndex: 1 }}
        />
        {notes.map((note, index) => (
          <Rnd
            key={note.id}
            size={{ width: note.width, height: note.height }}
            position={{ x: note.x + index * 20, y: note.y + index * 20 }}
            onDragStop={(e, d) => handleDragStop('note',note.id, d.x, d.y)}
            onResizeStop={(e, direction, ref, delta, position) => {
              handleResizeStop('note',note.id, ref.offsetWidth, ref.offsetHeight);
            }}
            style={{
              zIndex: 2,
              backgroundColor: selectedColor,
              cursor: "move",
            }}
          >
            <div className="card card-body shadow"  onChange={(e) => handleChange('note',note.id, e.target.value)}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: note.color,
                border: "none",
                resize: "none",
                outline: "none",
              }}>
              {note.text}
            </div>
          </Rnd>
        ))}
        {pdfHighLightedText.map((pdfHighLightedText, index) => (
          <Rnd
            key={pdfHighLightedText.id}
            size={{ width: pdfHighLightedText.width, height: pdfHighLightedText.height }}
            position={{ x: pdfHighLightedText.x + index * 20, y: pdfHighLightedText.y + index * 20 }}
            onDragStop={(e, d) => handleDragStop('pdfExtractedText',pdfHighLightedText.id, d.x, d.y)}
            onResizeStop={(e, direction, ref, delta, position) => {
              handleResizeStop('pdfExtractedText',pdfHighLightedText.id, ref.offsetWidth, ref.offsetHeight);
            }}
            style={{
              zIndex: 2,
              backgroundColor: selectedColor,
              cursor: "move",
            }}
          >
            <div className="card card-body shadow"  onChange={(e) => handleChange('pdfExtractedText',pdfHighLightedText.id, e.target.value)}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: pdfHighLightedText.color,
                border: "none",
                resize: "none",
                outline: "none",
              }}>
              {pdfHighLightedText.text}
            </div>
          </Rnd>
        ))}
        {textboxes.map((textbox,index) => (
          <Rnd
            key={textbox.id}
            size={{ width: textbox.width, height: textbox.height }}
            position={{ x: textbox.x + index * 20, y: textbox.y + index * 20 }}
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
              padding: "10px",
              cursor: "move",
              // backgroundColor: textbox.color,
            }}
          >
            <textarea
              value={textbox.text}
              onChange={(e) => handleTextboxChange(textbox.id, e.target.value)}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: textbox.color,
                border: "none",
                resize: "none",
                outline: "none",
              }}
            />
          </Rnd>
        ))}
      </div>
    </div>
  );
};

export default Canvas;
