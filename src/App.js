import "./App.css";
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-pdfviewer/styles/material.css';
import PdfViewerComp from "./Components/pdfViewerCanvas.tsx";
  function App() {
  return (
    <div className="App">
      {/* <To_do></To_do> */}
      <PdfViewerComp/>
    </div>
  );
}

export default App;
