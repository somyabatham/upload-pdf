const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

// Middleware
app.use(express.json());
app.use(cors());
app.use("/files", express.static(path.join(__dirname, "files")));

// MongoDB connection
const mongoUrl =
  "mongodb+srv://RitikMangal:somya1234@cluster0.qfvzrxp.mongodb.net/userdata";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + " " + file.originalname);
  },
});

const upload = multer({ storage: storage });

const Newstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./selections");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + " " + file.originalname);
  },
});

const Newupload = multer({ storage: Newstorage });

// MongoDB Schema
const PdfSchema = new mongoose.Schema({
  title: String,
  pdf: String,
});

const PdfDetails = mongoose.model("PdfDetails", PdfSchema);

const NewPdfSchema = new mongoose.Schema({
  title: String,
  pdf: String,
});

const NewPdfDetails = mongoose.model("NewPdfDetails", NewPdfSchema);

// File upload route
app.post("/upload-files", upload.single("file"), async (req, res) => {
  try {
    const { title } = req.body;
    const fileName = req.file.filename;
    await PdfDetails.create({ title: title, pdf: fileName });
    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ status: "error", message: "Failed to upload file" });
  }
});
app.post("/Newupload-files", Newupload.single("file"), async (req, res) => {
  try {
    const { title } = req.body;
    const fileName = req.file.filename;
    await NewPdfDetails.create({ title: title, pdf: fileName });
    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ status: "error", message: "Failed to upload file" });
  }
});

// Get all files route
app.get("/get-files", async (req, res) => {
  try {
    const files = await PdfDetails.find({});
    res.status(200).json({ status: "ok", data: files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch files" });
  }
});

//  Get all files route
app.get("/Newget-files", async (req, res) => {
  try {
    const files = await NewPdfDetails.find({});
    res.status(200).json({ status: "ok", data: files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch files" });
  }
});

// Root route
app.get("/", async (req, res) => {
  res.send("Success!!!!!!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
