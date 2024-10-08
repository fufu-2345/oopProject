import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import '@fortawesome/fontawesome-free/css/all.min.css';
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
          <li>Home</li>
          <li>Competitions</li>
          <li>Datasets</li>
          <li>Models</li>
          <li>Code</li>
          <li>Discussion</li>
          <li>Learn</li>
          <li>More</li> 
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

        <br/>
        <p className="RSNA2024">RSNA 2024 Lumbar Spine Degenerative <br/>Classification</p>
        <p className="tagline">Classify lumbar spine degenerative conditions</p>
          
      
        <nav className="nav">
          <button className="nav-button">Overview</button>
          <button className="nav-button">Evaluation</button>
          <button className="nav-button">Data</button>
          <button className="nav-button">Rules</button>
          <button className="nav-button">Submit</button>
        </nav>

        <hr className="justLine"/>
        

      
      </div>

    </div>
  );
}

export default App;
