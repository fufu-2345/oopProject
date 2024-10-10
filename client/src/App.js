import React, { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { Button, Container, Form, Table } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { GoCode } from "react-icons/go";
import { VscLayoutPanelCenter } from "react-icons/vsc";
import { BsChatRightText } from "react-icons/bs";
import img from './img/idk.png';

import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [selectedFileData, setSelectedFileData] = useState([]);
  const [fileNames, setFileNames] = useState([]);

  // ฟังก์ชันดึงข้อมูลชื่อไฟล์จาก API
  const fetchFileNames = async () => {
      try {
          const response = await fetch('http://localhost:5000/api/files'); // เปลี่ยน URL ตามที่เซิร์ฟเวอร์ของคุณรัน
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const result = await response.json();
          setFileNames(result);
      } catch (error) {
          console.error('Error fetching file names:', error);
      }
  };

  // ฟังก์ชันดึงข้อมูลจากไฟล์ที่เลือก
  const fetchFileData = async (fileName) => {
      try {
          const response = await fetch(`http://localhost:5000/api/data/${fileName}`);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const result = await response.json();
          setSelectedFileData(result);
      } catch (error) {
          console.error('Error fetching file data:', error);
      }
  };

  useEffect(() => {
      fetchFileNames();
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



        <div>
      {/* ... Sidebar and other components remain unchanged ... */}

      <div className="container">
        <h1>File List</h1>
        <ul>
          {fileNames.map((fileName, index) => (
            <li key={index} onClick={() => fetchFileData(fileName)} style={{ cursor: 'pointer', color: 'blue' }}>
              {fileName}
            </li>
          ))}
        </ul>

        {selectedFileData.length > 0 && (
          <div>
            <h2>CSV Data Table</h2>
            <table>
              <thead>
                <tr>
                  {selectedFileData[0] && Object.keys(selectedFileData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedFileData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, idx) => (
                      <td key={idx}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ... Other components remain unchanged ... */}
      </div>
    </div>

    

        <br/><br/><br/><br/><br/><br/><br/><br/>

      </div>

    </div>
  );
}

export default App;
