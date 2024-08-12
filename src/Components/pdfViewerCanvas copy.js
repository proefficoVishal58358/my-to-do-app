import React, { useRef, useEffect,useState } from 'react';
import { PdfViewerComponent, Inject, Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner } from '@syncfusion/ej2-react-pdfviewer';

const PdfViewerWithDragDrop = () => {
    const pdfViewerRef = useRef(null);
    const canvasRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [dragContent, setDragContent] = useState({ type: '', content: '', startX: 0, startY: 0 });

    useEffect(() => {
        const pdfViewerElement = pdfViewerRef.current;
        const canvasElement = canvasRef.current;

        const handleMouseDown = (e) => {
            const selectedText = window.getSelection().toString();
            if (selectedText) {
                setDragging(true);
                setDragContent({
                    type: 'text',
                    content: selectedText,
                    startX: e.clientX,
                    startY: e.clientY
                });
            }

            // Custom handling for images could be added here
        };

        const handleMouseMove = (e) => {
            if (dragging) {
                // Custom drag behavior (visual feedback can be added here)
                e.preventDefault();
            }
        };

        const handleMouseUp = (e) => {
            if (dragging) {
                if (e.target === canvasElement) {
                    const ctx = canvasElement.getContext('2d');
                    if (dragContent.type === 'text') {
                        ctx.font = '16px Arial';
                        ctx.fillText(
                            dragContent.content,
                            e.clientX - canvasElement.offsetLeft,
                            e.clientY - canvasElement.offsetTop
                        );
                    }
                    // Handle image drop logic here
                }

                setDragging(false);
                setDragContent({ type: '', content: '', startX: 0, startY: 0 });
            }
        };

        pdfViewerElement.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            pdfViewerElement.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, dragContent]);

    return (
        <div style={{ display: 'flex' }}>
            <PdfViewerComponent
                ref={pdfViewerRef}
                id="container"
                documentPath="http://localhost:3000/keyboard-shortcuts-windows.pdf"
                resourceUrl="https://cdn.syncfusion.com/ej2/24.1.41/dist/ej2-pdfviewer-lib"
                style={{ height: '100vh', width: '70%' }}
                >
                
                <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView,
                    Print, TextSelection, TextSearch, FormFields, FormDesigner]} />
            </PdfViewerComponent>
            
            <canvas
                ref={canvasRef}
                style={{ height: '100vh', width: '30%', border: '1px solid black' }}>
            </canvas>
        </div>
    );
};

export default PdfViewerWithDragDrop;
