import React, { useRef, useEffect, useState } from "react";
import Split from 'react-split';

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
import CanvasNew2 from "./canvasNew2";
const PdfViewerComp = () => {
  interface LinkMap {[key: string]: string;}
  const [sizes, setSizes] = useState([50, 50]);
  const pdfViewerRef = useRef(null);
  const [annotationData, setAnnotationData] = useState(null);
  const [annotaionType, setAnnotaionType] = useState(null);
  const [annotaionText, setAnnotaionText] = useState(null);
  const [pagesIndexes, setPageIndexes] = useState<{ pageIndex: number }[]>([]);
  const [argIndexes, setArgIndexes] = useState(null);
  const [annoDict, setAnnoDict] = useState<{ extrPageIndex: number, pageLinkedId:string }[]>([]);
  const [annoDictTextBox, setAnnoDictTextBox] = useState<{ textBoxPageIndex: number, pageLinkedId:string }[]>([]);
  const [viewerIns, setViewerIns] = useState<any>(null);
  const [annotId, setAnnotId] = useState<any>('')
  const [linkMap, setLinkMap] = useState<LinkMap>({})
  const [linkA, setLinkA] = useState<any>('');
  const [linkB, setLinkB] = useState<any>('');
  const [mappedId, setMappedId] = useState<any>(undefined);
  const [rightLinkMappedId, setRightLinkMappedId] = useState<any>(undefined);
  const [textBoxLinkId, setTextBoxLinkId] = useState<any>(undefined);
  const[sizeCursor,setSizeCursor]=useState('ew-resize');
  const[flagTextBox,setFlagForTextbox]=useState<boolean >(false);
  let viewer: PdfViewerComponent | null = null;

  const handleAnnotationAdd = async (args: any) => {
    console.log('args',args)
    let argsPageIndex = args.pageIndex;
    setArgIndexes(argsPageIndex);
    setAnnotationData(args.annotationSettings);
    setAnnotaionType(args.annotationType);
    setAnnotaionText(args.textMarkupContent);
    setPageIndexes((prev) => [...prev, { pageIndex: argsPageIndex + 1 }]);
    setAnnotId(args);
    if(args.annotationType!="Ink"){
      console.log('args.annotationType',args.annotationType)
      setMappedId(args.annotationId);
        setRightLinkMappedId(undefined)
        setAnnoDict((prev)=> [...prev,{ extrPageIndex: argsPageIndex, pageLinkedId: args.annotationId}]);
    }else{
      console.log('flagTextBox',flagTextBox)
      if(!flagTextBox){
        setRightLinkMappedId(args.annotationId);
        setAnnoDict(prevState =>
          prevState.map(ele =>
            ele.pageLinkedId == mappedId ? { ...ele, rightLinkId: args.annotationId, rightLinkpageIndex: argsPageIndex} : ele
          )
        );
      }else{
        setRightLinkMappedId(undefined);
        setTextBoxLinkId(args.annotationId)
        setAnnoDictTextBox((prev)=> [...prev,{ textBoxPageIndex: argsPageIndex, pageLinkedId: args.annotationId}]);
      }
      console.log(mappedId,'mappedId')
      }
      if (!linkA) {
        setLinkA(args)
      } else if (linkA.annotationId !== args.annotationId) {
        setLinkB(args)
      }    
    }
    console.log('annoDict',annoDict);

    const handleAnnotationRemove = async (args: any) => {
      setAnnotId('')
      setLinkB('')
      setLinkA('')
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

const handleResize = (newSizes) => {
  setSizes(newSizes);
  console.log('Resized to:', newSizes);
};
  return (
    <Split
    sizes={[50, 50]}
    minSize={100}
    expandToMin={false}
    gutterSize={5}
    gutterAlign="center"
    direction="horizontal"
    cursor={sizeCursor}
    style={{display:"flex", overflowX:"hidden", backgroundColor:"gray", height:"100vh"}}
    onDrag={(newSizes) => handleResize(newSizes)}
    >
        <PdfViewerComponent
          id="container"
          documentPath="http://localhost:3000/Mr. Deepak and another Vs. Smt. Jagwati and others9dc2b3 (3).pdf"
          resourceUrl="https://cdn.syncfusion.com/ej2/24.1.41/dist/ej2-pdfviewer-lib"
          inkAnnotationSettings={{author: 'Syncfusion', strokeColor: 'red', thickness: 6, opacity: 0.8}}
          ref={pdfViewerRef}
          enableTextSearch={true}
          annotationAdd={handleAnnotationAdd}
          annotationRemove={handleAnnotationRemove}
          style={{width:`${sizes[0]}%`}}
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
        <CanvasNew2
          style={{width:`${sizes[1]}%`}}
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
          setTextBoxLinkId={setTextBoxLinkId}
          setRightLinkMappedId={setRightLinkMappedId}
          rightLinkMappedId={rightLinkMappedId}
          textBoxLinkId={textBoxLinkId}
          annoDict={annoDict}
          annoDictTextBox={annoDictTextBox}
          setAnnoDict={setAnnoDict}
          setAnnoDictTextBox={setAnnoDictTextBox}
          argIndexes={argIndexes}
          setFlagForTextbox={setFlagForTextbox}
        />
    </Split>
  );
};

export default PdfViewerComp;
