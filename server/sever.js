const express = require('express');  ///สร้าง http        
const fs = require('fs');  ///อ่าน file
const path = require('path');
const Papa = require('papaparse');
const dicomParser = require('dicom-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
const baseDirectory = path.join(__dirname, 'csv-files');

app.get('/', (req, res) => {
    res.send("testtttttttttt");
});


/// folder folder
const getFileTree = (dir) => {
  const result = [];
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      result.push({
        name: file,
        type: 'folder',
        contents: getFileTree(filePath),
      });
    } else {
      result.push({
        name: file,
        type: 'file',
      });
    }
  });

  return result;
};




///// set file เหมือน constructor    เช็คว่าสิ้นสุดยัง
app.get('/list-files', (req, res) => {
  try {
    const fileTree = getFileTree(baseDirectory)
    res.json(fileTree)
  } catch (err) {
    console.error('Error reading directory:', err);
    res.status(500).send('Error reading directory');
  }
});



//// daicom
app.get('/read-dicom', (req, res) => {
  const fileName = req.query.file;
  const filePath = path.join(baseDirectory, fileName);

  fs.readFile(filePath, (err, data) => {
      if (err) {
          console.error('Error reading file:', err);
          return res.status(500).send('Error reading file');
      }
      res.set('Content-Type', 'application/dicom');
      res.send(data);
  });
});



//// csv
app.get('/read-csv', (req, res) => {
  const fileName = decodeURIComponent(req.query.file);
  const fullPath = path.join(baseDirectory, fileName);
  console.log('Full Path:', fullPath);

  fs.readFile(fullPath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading file:', err);
          return res.status(500).send('Error reading file');
      }
      res.send(data);
  });
});




app.get('/read-file' , (req , res) => {
  const fileName = req.query.file
  const filePath = path.join(baseDirectory , fileName)

  fs.readFile(filePath , 'utf-8' , (err , data) => {
    if(err){
      return res.status(500).send('Error reading file');
    }
    res.send(data)
  })
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
