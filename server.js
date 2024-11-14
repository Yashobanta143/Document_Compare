import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import pdfUtil from "pdf-to-text";


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const upload = multer({ dest: './uploads/' });
const cpUpload = upload.fields([
  { name: 'document', maxCount: 1 },
  { name: 'sampleDocument', maxCount: 1 },
]);


app.post("/compare", cpUpload, async (req, res) => {
  try {
    const file1 = req.files.document[0].path;
    const file2 = req.files.sampleDocument[0].path;
    const text1 = await extractPdfText(file1);
    const text2 = await extractPdfText(file2);
    const difference = compareText(text1, text2);
    if (!difference) {
      throw new Error('No differences found');
    } 
    res.json(difference);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


function pdfToText(document) {
  return new Promise((resolve, reject) => {
    pdfUtil.pdfToText(document, (err, data) => {
      if (err) reject(err);
      resolve(data);
      return data;
    });
  });
}


async function extractPdfText(document) {
  try {
    const extractedText = await pdfToText(document);
    return extractedText;
  } catch (err) {
    console.error('Error extracting text:', err.message);
    throw err;
  }
}


function compareText(text1, text2) {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const differences = [];

  for (let i = 0; i < Math.max(lines1.length, lines2.length); i++) {
    if (lines1[i] !== lines2[i]) {
      differences.push({
        line: i + 1,
        document: lines1[i] || '',
        sampleDocument: lines2[i] || '',
      });
    }
  }
  return differences;
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
