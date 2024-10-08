import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { Button, Container, Form, Table } from 'react-bootstrap';
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
          <li className="compet">Competitions</li>
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
          





        แก้เป็น list เรียงกันแนวนอน
        <Container className="topContainer">
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th width="10%" className="topTH">Overview</th>
                <th width="10%" className="topTH">Data</th>
                <th width="10%" className="topTH">Code</th>
                <th width="10%" className="topTH">Models</th>
                <th width="10%" className="topTH">Discussion</th>
                <th width="10%" className="topTH">Leaderboard</th>
                <th width="10%" className="topTH">Rules</th>
              </tr>
            </thead>
          </Table>
        </Container>

        <hr className="justLine"/>
        

      
      </div>

    </div>
  );
}

export default App;
