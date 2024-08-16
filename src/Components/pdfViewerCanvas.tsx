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
const PdfViewerComp = () => {
  interface LinkMap {[key: string]: string;}
  const pdfViewerRef = useRef(null);
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
      }
  console.log('annote dictionary',annoDict)

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

useEffect(() => {
    if (viewerIns) {
        console.log('Viewer instance is set:', viewerIns);
    }
}, [viewerIns]);

const addLink = (id: string, mappedId: string) => {
  setLinkMap(prevLinkMap => ({
      ...prevLinkMap,
      [id]: mappedId
  }));
};
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
        />
      </div>
    </div>
  );
};

export default PdfViewerComp;
