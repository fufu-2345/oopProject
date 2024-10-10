const express = require('express');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

// API สำหรับดึงชื่อไฟล์
app.get('/api/files', (req, res) => {
    const folderPath = path.join(__dirname, 'csv-files'); 
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Error reading directory');
        }

        const csvFiles = files.filter(file => file.endsWith('.csv'));
        res.json(csvFiles);
    });
});

// API สำหรับดึงข้อมูลจากไฟล์ที่เลือก
app.get('/api/data/:fileName', (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, 'csv-files', fileName);

    fs.readFile(filePath, 'utf8', (err, fileData) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        const results = Papa.parse(fileData, {
            header: true,
            skipEmptyLines: true
        });

        res.json(results.data);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
