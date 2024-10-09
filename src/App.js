import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { Button, Container, Form, Table } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { GoCode } from "react-icons/go";
import { VscLayoutPanelCenter } from "react-icons/vsc";
import { BsChatRightText } from "react-icons/bs";

import './App.css';

function App() {
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
        </ul>

        <hr className="justLine"/>

        <p className="bigText">Dataset Description</p>

        <p className="topFar">The goal of this competition is to identify medical conditions affecting the lumbar spine in MRI scans.</p>
        <p className="same">This competition uses a hidden test. When your submitted notebook is scored, the actual test data (including a full length sample</p>
        <p className="same">submission) will be made available to your notebook.</p>
        <br/>

        <p className="bigText">Files</p>
     

        <p className="traincsv">
          <span className="blackText">train.csv</span> Labels for the train set.
        </p>

      
        <div className="data-section">
                <ul>
                    <li><strong>study_id</strong> - The study ID. Each study may include multiple series of images.</li>
                    <li><strong>series_id</strong> - The target labels, such as spinal_canal_stenosis_l1_l2, with the severity levels of </li>
                    <li><strong>condition</strong> - There are three conditions: spinal canal stenosis, neural_foraminal_narrowing, and subarticular_stenosis.</li>
                    <li><strong>level</strong> - The relevant vertebrae, such as 13_14.</li>
                    <li><strong>[x/y]</strong> - The x/y coordinates for the center of the area that defined the label.</li>
                </ul>
            </div>




            <br/><br/><br/><br/><br/><br/>
            <div className="data-section">
                <h3>sample_submission.csv</h3>
                <ul>
                    <li><strong>row_id</strong> - A slug of the study ID, condition, and level.</li>
                    <li><strong>[normal/mild/moderate/severe]</strong> - The three prediction columns.</li>
                </ul>
            </div>

            <div className="data-section">
                <h3>[train/test]_images/[study_id]/[series_id]/[instance_number].dcm</h3>
                <p>The imagery data.</p>
            </div>

            <div className="data-section">
                <h3>[train/test]_series_descriptions.csv</h3>
                <ul>
                    <li><strong>study_id</strong></li>
                    <li><strong>series_id</strong></li>
                    <li><strong>series_description</strong> - The scan's orientation.</li>
                </ul>
            </div>

      </div>

    </div>
  );
}

export default App;
