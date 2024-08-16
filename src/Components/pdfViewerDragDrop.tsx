import React, { useRef, useEffect, useState } from "react";
import {
  PdfViewerComponent,
  Inject,
  Toolbar,
  Magnification,
  Navigation,
  Annotation,
  LinkAnnotation,
  BookmarkView,
  ThumbnailView,
  Print,
  TextSelection,
  TextSearch,
  FormFields,
  FormDesigner,
  PageOrganizer,
  ToolbarSettingsModel,
  CustomToolbarItemModel,
  AnnotationDataFormat, AnnotationResizerLocation,
  ContextMenuSettings, ContextMenuItem, ContextMenuSettingsModel,
  AnnotationSelectorSettingsModel
} from "@syncfusion/ej2-react-pdfviewer";
import Canvas from "./canvas";
const PdfViewerWithDragDropDiv = () => {
  const [selectedText, setSelectedText] = useState<string>("");
  const [dragging, setDragging] = useState<boolean>(false);
  const [droppedText, setDroppedText] = useState("");
  interface LinkMap {[key: string]: string;}
  const pdfViewerRef = useRef<PdfViewerComponent | null>(null);

  const [annotationData, setAnnotationData] = useState(null);
  const [annotaionType, setAnnotaionType] = useState(null);
  const [annotaionText, setAnnotaionText] = useState(null);
  const [pagesIndexes, setPageIndexes] = useState<{ pageIndex: number }[]>([]);
  const [annoDict, setAnnoDict] = useState<{ pageIndex: number,pageLinkedId:number }[]>([]);
  const [viewerIns, setViewerIns] = useState<any>(null);
  const [annotId, setAnnotId] = useState<any>('')
  const [linkMap, setLinkMap] = useState<LinkMap>({})
  const [linkA, setLinkA] = useState<any>('');
  const [linkB, setLinkB] = useState<any>('');
  const [mappedId, setMappedId] = useState<any>('');
  let viewer: PdfViewerComponent | null = null;
  const handleAnnotationAdd = async (args: any) => {
    console.log('args',args)
    const argsPageIndex = args.pageIndex;
    setAnnotationData(args.annotationSettings);
    setAnnotaionType(args.annotationType);
    setAnnotaionText(args.textMarkupContent);
    setPageIndexes((prev) => [...prev, { pageIndex: argsPageIndex + 1 }]);
    setAnnotId(args);
    setMappedId(args.annotationId);
    setAnnoDict((prev) => [...prev, {pageIndex : argsPageIndex, pageLinkedId : args.annotationId}]);
    if (!linkA) {
      setLinkA(args)
    } else if (linkA.annotationId !== args.annotationId) {
        setLinkB(args)
    }    
    if (args.annotationType!='Ink'){
      viewerIns.annotation.setAnnotationMode("None")
    }
    
    // addAnnotation(args, annoDict, setAnnoDict)
  }
  console.log('annote dictionary',annoDict)

const handleAnnotationRemove = async (args: any) => {
  setAnnotId('')
  setLinkB('')
  setLinkA('')
  // removeAnnotation(args.annotationId, annoDict, setAnnoDict, linkMap, setLinkMap)
}

  useEffect(() => {
    const viewerContainer = document.getElementById('container');
    if (viewerContainer && (viewerContainer as any).ej2_instances && (viewerContainer as any).ej2_instances[0]) {
        const viewerInstance = (viewerContainer as any).ej2_instances[0];
        setViewerIns(viewerInstance);
    } else {
        console.error('Viewer container or its instance was not found.');
    }
}, []); 

useEffect(() => {
    if (viewerIns) {
        console.log('Viewer instance is set:', viewerIns);
    }
}, [viewerIns]);


// const getMappedId = (id: string) => {
//   return annoDict[linkMap[id]] || null;
// };

const addLink = (id: string, mappedId: string) => {
  setLinkMap(prevLinkMap => ({
      ...prevLinkMap,
      [id]: mappedId
  }));
};
const handleConfirm = () => {
  if (linkA.annotationId !== linkB.annotationId) {
      addLink(linkA.annotationId, linkB.annotationId);
      addLink(linkB.annotationId, linkA.annotationId);
      //setAnnotId(linkB)
      //viewerIns.annotation.selectAnnotation(linkB.annotationId)
  }
  setLinkA('');
  setLinkB('');
};

const handleTextSelectionEnd = (args : any) => {
  console.log('handle text selecction',args)
  const text = args.textContent;
  setSelectedText(text);
    if (text) {
      setDragging(true);
    }
};
const handleDragStart = (event) => {
  console.log('event 121',event)
  if (selectedText) {
    event.dataTransfer.setData("text/plain", selectedText);
  }
  setDragging(false);
};

const handleDragEnd = () => {
  setDragging(false);
};

const handleDrop = (event:any) => {
  event.preventDefault();
  const droppedText = event.dataTransfer.getData("text");
  console.log("Dropped Text:", droppedText);
  setDroppedText(droppedText)
};
  // Prevent default behavior to allow dropping
  const handleDragOver = (event:any) => {
    event.preventDefault();
  };

  useEffect(() => {
    const viewerElement = pdfViewerRef.current?.element as HTMLElement; // Accessing the viewer DOM element
    const mouseMoveHandler = (event) => {
      console.log('dragging-',dragging)
      if (dragging) {
        console.log('event 145',event)
        const tempDraggable = document.createElement("div");
        tempDraggable.setAttribute("id", "draggableDiv");
        tempDraggable.style.position = "absolute";
        tempDraggable.style.top = `${event.clientY}px`;
        tempDraggable.style.left = `${event.clientX}px`;
        tempDraggable.style.background = "pink";
        tempDraggable.style.cursor = "grab";
        tempDraggable.style.zIndex = "9999";
        tempDraggable.style.height = "100px";
        tempDraggable.style.width = "100px";
        tempDraggable.style.color = "black";
        tempDraggable.innerHTML = selectedText;


        tempDraggable.draggable = true;
        viewerElement.appendChild(tempDraggable);
        tempDraggable.addEventListener("dragstart", handleDragStart);
        tempDraggable.addEventListener("dragend", () => {
          tempDraggable.remove();
          handleDragEnd();
        });
        const dragEvent = new DragEvent("dragstart", {
          bubbles: true,
          cancelable: true,
          dataTransfer: new DataTransfer(),
        });
        tempDraggable.dispatchEvent(dragEvent);

        viewerElement.removeEventListener("mousemove", mouseMoveHandler);
      }
    };
    viewerElement.addEventListener("mousemove", mouseMoveHandler);
    return () => {
      viewerElement.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [dragging, selectedText]);



  return (
    <div>
      <div style={{ display: "flex" ,overflowX:"hidden"}}>
        <PdfViewerComponent
          id="container"
          documentPath="http://localhost:3000/Mr. Deepak and another Vs. Smt. Jagwati and others9dc2b3 (3).pdf"
          resourceUrl="https://cdn.syncfusion.com/ej2/24.1.41/dist/ej2-pdfviewer-lib"
          style={{ height: "auto", width: "60%" }}
          ref={pdfViewerRef}
          enableTextSearch={true}
          annotationAdd={handleAnnotationAdd}
          annotationRemove={handleAnnotationRemove}
          textSelectionEnd={handleTextSelectionEnd}
          
        >
          <Inject
            services={[
              Toolbar,
              Magnification,
              Navigation,
              Annotation,
              LinkAnnotation,
              BookmarkView,
              ThumbnailView,
              Print,
              TextSelection,
              TextSearch,
              FormFields,
              FormDesigner,
            ]}
          />
       
        </PdfViewerComponent>
        {/* <div
        style={{ width: "40%", height: "100vh", border: "1px solid black" }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
       {droppedText}
      </div>
        <div
        style={{
          marginTop: "20px",
          padding: "10px",
          border: "1px solid black",
          cursor: "grab",
        }}
        draggable
        onDragStart={handleDragStart}
      >
        {selectedText || "Select text from the PDF"}
      </div> */}
        <Canvas
          pdfViewerRef={pdfViewerRef}
          annotaionType={annotaionType}
          annotationData={annotationData}
          annotaionText={annotaionText}
          pagesIndexes={pagesIndexes}
          viewerIns={viewerIns}
          mappedId={mappedId}
          annotId={annotId}
          viewer={viewer}
          setMappedId={setMappedId}
          annoDict={annoDict}
          setAnnoDict={setAnnoDict}
          canvasOnDrop={handleDrop}
          onDragOver={handleDragOver}
          droppedText={droppedText}
        />
      </div>
    </div>
  );
};

export default  PdfViewerWithDragDropDiv ;
