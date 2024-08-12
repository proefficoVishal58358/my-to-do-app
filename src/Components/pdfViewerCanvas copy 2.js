import React, { useRef, useEffect,useState } from 'react';
import { PdfViewerComponent, Inject, Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner } from '@syncfusion/ej2-react-pdfviewer';

const PdfViewerWithDragDrop = () => {
    const pdfViewerRef = useRef(null);
    const canvasRef = useRef(null);

    // Handle drag start from the PDF viewer
    const handleDragStart = (event) => {
        const selectedText = pdfViewerRef.current.viewerBase.textLayer.selectedText;
        event.dataTransfer.setData('text/plain', selectedText || 'Dragged content from PDF');
        event.dataTransfer.effectAllowed = 'copyMove';
    };

    // Handle drag over on the canvas
    const handleDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    };

    // Handle drop on the canvas
    const handleDrop = (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.fillText(data, event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    };
    const handleAnnotationAdd = (event) => {
        console.log('Annotation added:', event);

        // You can access the annotation details like this:
        const annotation = event.annotationSettings;
        const text = event.textMarkupContent; // Selected text
        const bounds = annotation.bounds; // Bounding box of the annotation
        const author = annotation.author; // Author of the annotation
        const type = annotation.type; // Type of annotation (e.g., Highlight, Underline, etc.)

        console.log(`Selected Text: ${text}`);
        console.log(`Author: ${author}`);
        console.log(`Bounds: ${JSON.stringify(bounds)}`);
        console.log(`Annotation Type: ${type}`);
    };
    return (
        <div style={{ display: 'flex' }}>
            <PdfViewerComponent
                ref={pdfViewerRef}
                id="container"
                documentPath="http://localhost:3000/keyboard-shortcuts-windows.pdf"
                resourceUrl="https://cdn.syncfusion.com/ej2/24.1.41/dist/ej2-pdfviewer-lib"
                style={{ height: '100vh', width: '70%' }}
                onDragStart={handleDragStart}
                annotationAdd={handleAnnotationAdd}
            >
                <Inject services={[ Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView,
                                   Print, TextSelection, TextSearch, FormFields, FormDesigner]} />
            </PdfViewerComponent>

            <canvas
                ref={canvasRef}
                style={{ height: '100vh', width: '30%', border: '1px solid black' }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
            </canvas>
        </div>
    );
};

export default PdfViewerWithDragDrop;
