

import { React, useState } from "react";
import { Document, Page } from "react-pdf";

function PdfComp(props) {
  const [numPages, setNumPages] = useState();
  const [selectedPages, setSelectedPages] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setSelectedPages(Array.from({ length: numPages }, (_, i) => i + 1));
  }

  function togglePageSelection(page) {
    if (selectedPages.includes(page)) {
      setSelectedPages(selectedPages.filter(p => p !== page));
    } else {
      setSelectedPages([...selectedPages, page]);
    }
        // Update the page number to the first selected page
    const firstSelectedPage = selectedPages.length > 0 ? selectedPages[0] : 1;
    setPageNumber(firstSelectedPage);
  }

  // const downloadPdf=()=> {
  function downloadPdf() {

    
    // Create a new document containing only selected pages
    const newPdfDoc = new Blob(
      [props.pdfFile],
      { type: 'application/pdf' }
    );

    // 
    const url = window.URL.createObjectURL(new Blob([newPdfDoc]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `selected-pdf.pdf`);
    document.body.appendChild(link);
    // Trigger the download
    link.click();
    link.parentNode.removeChild(link);
    
  }
  return (
    <div className="pdf-div">
      <p>
        Page {pageNumber} of {numPages}
      </p>
      <Document file={props.pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
        {selectedPages.map((page) => (
          <Page 
            key={page}
            pageNumber={page}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
      <div>
        {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
          <label key={page}>
            <input
              type="checkbox"
              checked={selectedPages.includes(page)}
              onChange={() => togglePageSelection(page)}
            />
            Page {page}
          </label>
        ))}
      </div>
    <button onClick={downloadPdf}  >Download Selected Pages</button>
    </div>
  );
}
export default PdfComp;
