app.post("/compare", upload.single('document'), async (req, res) => {
    try {
      const document = req.file.path;
      const file = "./sample.pdf";
      const text1 = await anotherFunction(document);
      // console.log(text1);
      const text2 = await anotherFunction(file);
      const difference = compareText(text1, text2);
      console.log(difference);
      res.json(difference); // Send response back to client
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  })
  
  function extractPdfText(document) {
    return new Promise((resolve, reject) => {
      pdfUtil.pdfToText(document, (err, data) => {
        if (err) reject(err);
        resolve(data);
        return data;
      });
    });
  }
  
  async function anotherFunction(document) {
    try {
      const extractedText = await extractPdfText(document);
      // console.log(extractedText); // Use the extracted text
      return extractedText;
      // Your code here
    } catch (err) {
      console.error(err);
    }
  }
  
  
  function compareText(text1, text2) {
    // Split the text into individual lines
    // console.log(text1);
    // console.log(text2);
    const lines1 = text1.split('\n');
    // console.log(lines1)
    const lines2 = text2.split('\n');
  
    // Initialize an array to store the differences
    const differences = [];
  
    // Iterate over the lines of the two documents
    for (let i = 0; i < Math.max(lines1.length, lines2.length); i++) {
        // Check if the lines are different
        if (lines1[i] !== lines2[i]) {
            // Add the difference to the array
            differences.push({
                line: i + 1,
                document: lines1[i],
                sampleDocument: lines2[i],
            });
        }
        else {
          // console.log("identical");
        }
    }
    // console.log(differences);
    return differences;
  }