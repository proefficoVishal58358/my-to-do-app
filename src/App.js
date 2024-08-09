import "./App.css";
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-pdfviewer/styles/material.css';
import PdfViewerWithDragDrop from "./Components/pdfViewerCanvas";
  function App() {
  return (
    <div className="App">
      {/* <To_do></To_do> */}
      <PdfViewerWithDragDrop/>
    </div>
  );
}

export default App;
