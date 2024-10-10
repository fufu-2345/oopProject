import React, { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { Button, Container, Form, Table } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { GoCode } from "react-icons/go";
import { VscLayoutPanelCenter } from "react-icons/vsc";
import { BsChatRightText } from "react-icons/bs";
import { FaRegFolder } from "react-icons/fa";
import { GrColumns } from "react-icons/gr";
import { IoMdArrowDropright } from "react-icons/io";
import { FaRegFileAlt } from "react-icons/fa";
import img from './img/idk.png';

import './App.css';

function App() {
  const [folders, setFolders] = useState([]);
  const [csvFiles, setCsvFiles] = useState([]);
  const [fileContent, setFileContent] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState('');
  const [fileSize, setFileSize] = useState(null);

  const fetchFoldersAndFiles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/folders');
      const data = await response.json();
      setFolders(data.folders);
      setCsvFiles(data.csvFiles);
      } catch (error) {
          console.error('Error fetching folders:', error);
      }
  };

  const fetchFileContent = async (fileName) => {
    try { 
        const response = await fetch(`http://localhost:5000/api/file/${fileName}`);
        if (!response.ok) {
            const errorDetails = await response.text(); 
             throw new Error(`HTTP error! status: ${response.status}, Details: ${errorDetails}`);
         }
         const data = await response.json();
         setFileContent(data);

         const size = response.headers.get('Content-Length');
          if (size) {
              const sizeInMB = size / (1024 * 1024);
              const sizeInKB = size / 1024;
              setFileSize(sizeInMB >= 1 ? `${sizeInMB.toFixed(2)} MB` : `${sizeInKB.toFixed(2)} kB`);
          } else {
              setFileSize('Unknown size');
          }
     } catch (error) {
         console.error('Error fetching file content:', error);
     }
  };
    
  const handleFileClick = (fileName) => {
    console.log(`Clicked file: ${fileName}`);
    setSelectedFile(fileName);
    fetchFileContent(fileName);
  };
  
  const handleFolderClick = (folder) => {
    console.log(`Clicked folder: ${folder.name}`);
    setSelectedFolder(folder);
  };
  

  useEffect(() => {
      fetchFoldersAndFiles();
  }, []);


  return (
    <div>

      <div className="sidebar">

        <div className="sidebar-header">
          <button className="circle-button">
            <FaBars className="hamberger"/>
          </button>
          <p className="kaggle">kaggle</p>
        </div>

        <br/>

        <button className="create-button">
          <span className="icon">+  </span>
          <p>Create</p>
        </button>

        <ul>
          <ul>
            <li><i className="far fa-compass iconSide"/>Home</li>
            <li className="compet"><FontAwesomeIcon icon={faTrophy} className="iconcompet" />Competitions</li>
            <li><VscLayoutPanelCenter className="iconSide" />Datasets</li>
            <li><i className='fas fa-sitemap iconSide'/>Models</li>
            <li><GoCode className="iconSide" />Code</li>
            <li><BsChatRightText className="iconSide" />Discussion</li>
            <li><i className="fas fa-graduation-cap iconSide"/>Learn</li>
            <li><i className="fa fa-angle-down iconSide" aria-hidden="true"/>More</li> 
          </ul>
        </ul>

      </div>

      

      <div className="container">
        <img src={img} alt="รูปขวาบน" className="img" />
        <div className="search-bar">
            <button disabled>
                <i className="fas fa-search"></i>
            </button>
            <input 
                type="text" 
                placeholder="Search" 
                disabled
                
            />
        </div>

        <br/><br/><br/><br/>
        <p className="RSNA2024">RSNA 2024 Lumbar Spine Degenerative <br/>Classification</p>
        <p className="tagline">Classify lumbar spine degenerative conditions</p>
          

        <ul className="newlist">
          <li>Overview</li>
          <li className="data">Data</li>
          <li>Code</li>
          <li>Models</li>
          <li>Discussion</li>
          <li>Leaderboard</li>
          <li>Rules</li>
          <li>Team</li>
          <li>Submissions</li>
        </ul>

        <hr className="justLine"/>

        <p className="bigText">Dataset Description</p>

        <p className="topFar">The goal of this competition is to identify medical conditions affecting the lumbar spine in MRI scans.</p>
        <p className="same">This competition uses a hidden test. When your submitted notebook is scored, the actual test data (including a full length sample</p>
        <p className="same">submission) will be made available to your notebook.</p>
        <br/>

        <p className="bigText2">Files</p>
     

        <p className="traincsv">
          <span className="blackText">train.csv</span> Labels for the train set.
        </p>


        <ul>
          <li className="textLi"><span className="Gray">study_id</span> - The study ID. Each study may include multiple series of images.</li>
          <li className="textLi">

            <span className="Gray">[condition]_[level]</span> - The target labels, such as <span className="Gray">spinal_canal_stenosis_l1_l2</span>, with the severity levels of <span className="Gray">Normal/Mild</span>,
            <br className="custom-br" />
            <span className="Gray"> Moderate</span>, or <span className="Gray">Severe</span>. Some entries have incomplete labels.</li>
        </ul>

        <p className="trainLable">
          train_label_coordinates.csv
        </p>

        <ul>
          <li className="textLi"><span className="Gray">study_id</span></li>
          <li className="textLi"><span className="Gray">series_id</span> - The imagery series ID.</li>
          <li className="textLi"><span className="Gray">instance_number</span> - The image's order number within the 3D stack.</li>
          <li className="textLi"><span className="Gray">condition</span> - There are three core conditions: spinal canal stenosis, neural_foraminal_narrowing, and subarticular_stenosis. The latter 
          <br/>two are considered for each side of the spine.</li>
          <li className="textLi"><span className="Gray">level</span> - The relevant vertebrae, such as <span className="Gray">l3_l4</span></li>
          <li className="textLi"><span className="Gray">[x/y]</span> - The x/y coordinates for the center of the area that defined the label.</li>   
        </ul>

        <p className="trainLable">
          sample_submission.csv
        </p>


        <ul>
          <li className="textLi"><span className="Gray">row_id</span> - A slug of the study ID, condition, and level such as<span className="Gray">12345_spinal_canal_stenosis_l3_l4</span>.</li>
          <li className="textLi"><span className="Gray">[normal_mild/moderate/severe]</span> - The three prediction columns.</li>
        </ul>

        <p className="trainLable">
          [train/test]_images/[study_id]/[series_id]/[instance_number].dcm<span className="imageryData"> The imagery data.</span>
        </p>

        <p className="trainLable">
          [train/test]_series_descriptions.csv
        </p>

        <ul>
          <li className="textLi"><span className="Gray">study_id</span></li>
          <li className="textLi"><span className="Gray">series_id</span></li>
          <li className="textLi"><span className="Gray">series_description</span>The scan's orientation.</li>
        </ul>

        

        <hr className="editHr"/>
        <br/><br/><br/>


        <div className="onRight">
          <p className="dataEx">Data Explorer</p>
          <div>
            {folders.map((folder, index) => (
              <div key={index}>
                    
                <h2 className="folderName" onClick={() => handleFolderClick(folder) }><FaRegFolder /> {folder.name}</h2>
                <ul className="noneDot">
                  {folder.files.map((file, fileIndex) => (
                    <li className="pointer" key={fileIndex} onClick={() => handleFileClick(file)}><IoMdArrowDropright /> <GrColumns /> {file}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <ul className="noneDot">
            {csvFiles.map((file, index) => (
              <li key={index} onClick={() => handleFileClick(file.name)}><GrColumns /> {file.name}</li>
            ))}
          </ul>
        </div>

        <div className="contain2">
          <div className="BLUEE">
            {fileContent && (
              <div  className="idk">
                <p className="upp"> 
                  <span className="fileName">
                    {selectedFile}
                  </span>
                  <span className="fileSize">
                    ({fileSize})
                  </span>
                </p>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      {Object.keys(fileContent[0]).map((key, index) => (
                        <th key={index}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fileContent.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((value, colIndex) => (
                          <td key={colIndex}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </div>

        <div>
          <span className="metaNote">
            <FaRegFileAlt /> 
          </span>

          <span className="Metadata">
            Metadata
          </span>
        </div>

        


        <hr className="editHr"/>

        <div>
          <span className="License">
            License
          </span>
          <br/>
          <p className="competRule">
            Subject to Competition Rules
          </p>
         
        </div>


        <hr className="editHr"/>

        <br/><br/><br/><br/><br/><br/>

      </div>

    </div>
  );
}

export default App;
