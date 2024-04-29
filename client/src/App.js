


import React, { useEffect, useState } from "react";
import axios from "axios";
import { pdfjs } from "react-pdf";
import PdfComp from "./PdfComp";

// Set worker source for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();


function App() {
  // State variables
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [allImage, setAllImage] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);

  // Fetch all PDF files on component mount
  useEffect(() => {
    getPdf();
    NewgetPdf();
    
  }, []);

  // Fetch all PDF files from the server
  
  const getPdf = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-files");
      setAllImage(response.data.data);
    } catch (error) {
      console.error("Error fetching PDF files:", error);
    }
  };
  const NewgetPdf = async () => {
    try {
      const response = await axios.get("http://localhost:5000/Newget-files");
      setAllImage(response.data.data);
    } catch (error) {
      console.error("Error fetching PDF files:", error);
    }
  };

  // Handle form submission for uploading PDF files
  const submitImage = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      alert("Please provide title and select a file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload-files",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data.status === "ok") {
        alert("Uploaded Successfully!!!");
        getPdf(); // Refresh PDF list after successful upload
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

  // Show selected PDF file
  const showPdf = (pdf) => {
    setPdfFile(`http://localhost:5000/files/${pdf}`);
  };
  // const NewshowPdf = (pdf) => {
  //   setPdfFile(`http://localhost:5000/selections/${pdf}`);
  // };

  return (
    <div className="App">
      <form className="formStyle" onSubmit={submitImage}>
        <h4>Upload Pdf in React</h4>
        <br />
        <input
          type="text"
          className="form-control"
          placeholder="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <input
          type="file"
          className="form-control"
          accept="application/pdf"
          required
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>

      <div className="uploaded">
        <h4>Uploaded PDF:</h4>
        <div className="output-div">
          {allImage.map((data) => (
            <div key={data._id} className="inner-div">
              <h6>Title: {data.title}</h6>
              <button
                className="btn btn-primary"
                onClick={() => showPdf(data.pdf)}
              >
                Show Pdf
              </button>

            </div>
          ))}
        </div>
      </div>

      {pdfFile && <PdfComp pdfFile={pdfFile} />}
    </div>
  );
}

export default App;



