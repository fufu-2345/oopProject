const express = require('express');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/api/folders', (req, res) => {
    const baseFolderPath = path.join(__dirname, 'csv-files');

    fs.readdir(baseFolderPath, { withFileTypes: true }, (err, items) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Error reading directory');
        }

        const folders = items
            .filter(item => item.isDirectory())
            .map(folder => ({
                name: folder.name,
                path: folder.name, // ส่งคืนชื่อโฟลเดอร์
                files: fs.readdirSync(path.join(baseFolderPath, folder.name)).filter(file => file.endsWith('.csv')) // อ่านไฟล์ในโฟลเดอร์
            }));

        const csvFiles = items
            .filter(item => item.isFile() && item.name.endsWith('.csv'))
            .map(file => ({
                name: file.name,
                path: file.name // ส่งคืนชื่อไฟล์ CSV
            }));

        res.json({ folders, csvFiles });
    });
});


app.get('/api/file/:fileName', (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, 'csv-files', fileName);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        const parsedData = Papa.parse(data, { header: true }); // แปลงข้อมูล CSV เป็น JSON
        res.json(parsedData.data); // ส่งข้อมูลที่แปลงแล้ว
    });
});

app.get('/api/folders', (req, res) => {
    const baseFolderPath = path.join(__dirname, 'csv-files');

    fs.readdir(baseFolderPath, { withFileTypes: true }, (err, items) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Error reading directory');
        }

        const folders = items
            .filter(item => item.isDirectory())
            .map(folder => ({
                name: folder.name,
                files: fs.readdirSync(path.join(baseFolderPath, folder.name)).filter(file => file.endsWith('.csv'))
            }));

        const csvFiles = items
            .filter(item => item.isFile() && item.name.endsWith('.csv'))
            .map(file => ({
                name: file.name,
                path: file.name
            }));

        res.json({ folders, csvFiles });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
