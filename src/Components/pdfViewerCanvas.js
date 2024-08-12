import React, { useRef, useEffect,useState } from 'react';
import { PdfViewerComponent, Inject, Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner } from '@syncfusion/ej2-react-pdfviewer';
import Canvas from './canvas';
const PdfViewerWithDragDrop = () => {
    const pdfViewerRef = useRef(null);
    const [annotationData,setAnnotationData]=useState(null)
    const [annotaionType,setAnnotaionType]=useState(null)
    const [annotaionText,setAnnotaionText]=useState(null)
    const handleAnnotationAdd = (event) => {
        console.log(event,'event')
        const annotation = event.annotationSettings;
        const type = event.annotationType;
        const text = event.textMarkupContent; 
        const bounds = annotation.bounds; 
        const author = annotation.author; 
        setAnnotationData(annotation);
        setAnnotaionType(type);
        setAnnotaionText(text);
        // console.log(`Selected Text: ${text}`);
        // console.log(`Author: ${author}`);
        // console.log(`Bounds: ${JSON.stringify(bounds)}`);
        // console.log(`Annotation Type: ${type}`);
    };
 

    

    return (
        <div>
        <div style={{ display: 'flex' }}>
            <PdfViewerComponent
                id="container"
                documentPath="http://localhost:3000/keyboard-shortcuts-windows.pdf"
                resourceUrl="https://cdn.syncfusion.com/ej2/24.1.41/dist/ej2-pdfviewer-lib"
                style={{ height: '100vh', width: '70%' }}
                ref={pdfViewerRef}
                annotationAdd={handleAnnotationAdd}
            >
                <Inject services={[ Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView,
                                   Print, TextSelection, TextSearch, FormFields, FormDesigner]} />
            </PdfViewerComponent>
            <Canvas annotaionType={annotaionType} annotationData={annotationData} annotaionText={annotaionText}/>
        </div>
        </div>
    );
};

export default PdfViewerWithDragDrop;
