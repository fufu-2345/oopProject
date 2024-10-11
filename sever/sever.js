const express = require('express');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const dicomParser = require('dicom-parser');
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
            .map(folder => {
                const folderPath = path.join(baseFolderPath, folder.name);
                const files = fs.readdirSync(folderPath);
                const csvFiles = files.filter(file => file.endsWith('.csv'));
                const dcmFiles = files.filter(file => file.endsWith('.dcm'));

                return {
                    name: folder.name,
                    files: [...csvFiles, ...dcmFiles] // Combine CSV and DICOM files
                };
            });

        const csvFiles = items
            .filter(item => item.isFile() && item.name.endsWith('.csv'))
            .map(file => ({
                name: file.name,
                path: file.name 
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

        const parsedData = Papa.parse(data, { header: true });
        res.json(parsedData.data);
    });
});

app.get('/api/dcm/:folderName/:fileName', (req, res) => {
    const { folderName, fileName } = req.params;
    const filePath = path.join(__dirname, 'csv-files', folderName, fileName); // Adjust path to include folder

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading DICOM file:', err);
            return res.status(500).send('Error reading DICOM file');
        }

        try {
            const byteArray = new Uint8Array(data);
            const dicomData = dicomParser.parseDicom(byteArray);
            res.json(dicomData);
        } catch (parseError) {
            console.error('Error parsing DICOM file:', parseError);
            return res.status(500).send('Error parsing DICOM file');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
