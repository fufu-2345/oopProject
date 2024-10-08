import React, { useState } from 'react';
import './App.css';

function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>RSNA 2024 Lumbar Spine Degenerative Classification</h1>
        <p className="tagline">Competition Overview</p>
      </header>

      <nav className="nav">
        <button className="nav-button">Overview</button>
        <button className="nav-button">Evaluation</button>
        <button className="nav-button">Data</button>
        <button className="nav-button">Rules</button>
        <button className="nav-button">Submit</button>
      </nav>

      <section className="section">
        <h2>Overview</h2>
        <p>
          This competition invites participants to develop models for classifying lumbar spine degenerative diseases based on MRI scans.
        </p>
      </section>

      <section className="section">
        <h2>Evaluation</h2>
        <p>
          Submissions will be evaluated based on their accuracy in classifying images into various categories.
        </p>
      </section>

      <section className="section">
        <h2>Data</h2>
        <p>
          The dataset consists of MRI images along with metadata. More details are provided in the data section.
        </p>
      </section>

      <section className="section">
        <h2>Rules</h2>
        <p>
          Participants must adhere to the competition rules, including ethical considerations for data usage.
        </p>
      </section>

      <footer className="footer">
        <p>© 2024 RSNA Competition</p>
      </footer>
    </div>
  );
}

export default App;
