const express = require('express');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/api/data', (req, res) => {
    const folderPath = path.join(__dirname, 'csv-files'); 
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err); // เพิ่มบรรทัดนี้เพื่อแสดงข้อผิดพลาด
            return res.status(500).send('Error reading directory');
        }

        const csvFiles = files.filter(file => file.endsWith('.csv'));
        const allData = [];

        csvFiles.forEach(file => {
            const filePath = path.join(folderPath, file);
            try {
                const fileData = fs.readFileSync(filePath, 'utf8');
                const results = Papa.parse(fileData, {
                    header: true,
                    skipEmptyLines: true
                });
                allData.push(...results.data);
            } catch (fileErr) {
                console.error('Error reading file:', fileErr); // เพิ่มบรรทัดนี้เพื่อแสดงข้อผิดพลาดในการอ่านไฟล์
            }
        });

        res.json(allData);
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
