import React, { useEffect, useState } from 'react';

import axios from 'axios';
import cornerstone, { enable } from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import Papa from 'papaparse';
import img from './img/idk.png';
import logo from './img/RSNA.png';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import 'typeface-roboto';

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

import './App.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

///////https://www.kaggle.com/competitions/rsna-2024-lumbar-spine-degenerative-classification/data

function App() {
  const [files, setFiles] = useState(null);
  const [dicomData, setDicomData] = useState(null);
  const [imageId, setImageId] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [openFolders, setOpenFolders] = useState({});
  const [showData, setData] = useState(null);
  const [chartData, setChartData] = useState({})

  const [selectedFile, setSelectedFile] = useState('');
  const [fileSize, setFileSize] = useState(null);

  useEffect(() => {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    const element = document.getElementById('dicomImage');
    cornerstone.enable(element);

    axios.get('http://localhost:5000/list-files').then(response => {
        setFiles(response.data);
    }).catch(error => {
        console.error('Error', error);
    });
  }, []);


    const handleFileClick = (filePath) => {
      const isDicom = filePath.endsWith('.dcm')
      const isCSV = filePath.endsWith('.csv')

        if (isDicom) {
            const fileURL = `http://localhost:5000/read-dicom?file=${filePath}`
            axios.get(fileURL, { responseType: 'arraybuffer' }).then(response => {
              const byteArray = new Uint8Array(response.data)
              const dataSet = dicomParser.parseDicom(byteArray)
              setDicomData(dataSet);
              const imageId = `wadouri:${fileURL}`;
              setImageId(imageId);

            }).catch(error => {
                console.log('Error ', error)
            })
        } else if (isCSV) {
            const fileURL = `http://localhost:5000/read-csv?file=${filePath}`
            axios.get(fileURL).then(response => {
                Papa.parse(response.data, {
                    header: true,
                    complete: (result) => {
                        setCsvData(result.data);
                    },
                    error: (error) => {
                        console.error('Error : ', error);
                    }
                })

              setSelectedFile(filePath.replace(/^\//, ''));
              const size = response.headers.get('Content-Length');
              if (size) {
                const sizeInMB = size / (1024 * 1024);
                const sizeInKB = size / 1024;
                setFileSize(sizeInMB >= 1 ? `${sizeInMB.toFixed(2)} MB` : `${sizeInKB.toFixed(2)} kB`);
              } else {
                  setFileSize('Unknown size');
              }

            }).catch(error => {
                console.error('Error : ', error)
            })
        }
    }


    useEffect(() => {
        const element = document.getElementById('dicomImage')

        if (imageId) {
            cornerstone.loadImage(imageId).then(image => {
                cornerstone.displayImage(element, image)
            }).catch(error => {
                console.error('Error : ', error)
            })
        }
    }, [imageId])


    useEffect(() => {
      if (csvData.length > 0) {
          const newChartData = {};
          const headers = Object.keys(csvData[0]);

          headers.forEach(header => {
              const values = csvData.map(row => row[header])
              const numericValues = values.filter(value => !isNaN(parseFloat(value)) && isFinite(value))
              if (values.length - 1 > 10) {
                  if (!numericValues.length && values.length) {
                      newChartData[header] = {
                          type: 'count',
                          totalCount: values.length - 1
                      }
                  } else {
                      const counts = numericValues.reduce((acc, value) => {
                          acc[value] = (acc[value] || 0) + 1;
                          return acc;
                      }, {});

                      newChartData[header] = {
                          type: 'chart',
                          labels: Object.keys(counts),
                          datasets: [{
                              label: header,
                              data: Object.values(counts),
                              backgroundColor: 'rgba(75, 192, 192, 0.6)',
                          }]
                      };
                  }
              } else if (values.length - 1 < 10 && values.length - 1 > 0) {
                  newChartData[header] = {
                      type: 'count',
                      totalCount: values.length - 1
                  }
              }

              if (values.length - 1 > 100) {
                  if (numericValues.length && values.length) {
                      const binSize = Math.ceil((Math.max(...numericValues.map(Number)) - Math.min(...numericValues.map(Number))) / 10)
                      const bins = {}
                      numericValues.forEach(value => {
                          const binIndex = Math.floor(Number(value) / binSize) * binSize
                          bins[binIndex] = (bins[binIndex] || 0) + 1
                      })

                      newChartData[header] = {
                          type: 'chart',
                          labels: Object.keys(bins).map(bin => `${bin}-${Number(bin) + binSize}`),
                          datasets: [{
                              label: header,
                              data: Object.values(bins),
                              backgroundColor: 'rgba(75, 192, 192, 0.6)',
                          }]
                      }
                  } else {
                      const counts = values.reduce((acc, value) => {
                          acc[value] = (acc[value] || 0) + 1;
                          return acc;
                      }, {});

                      const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);
                      const totalCount = values.length - 1;

                      let stringData = sortedCounts.slice(0, 2).map(([label, count]) => ({
                          label,
                          count,
                          percentage: ((count / totalCount) * 100).toFixed(0)
                      }));
                      console.log(sortedCounts.length)
                      const otherCount = totalCount - stringData.reduce((sum, item) => sum + item.count, 0);
                      if (otherCount > 0) {
                          stringData.push({
                              label: `Other (${otherCount})`,
                              count: otherCount,
                              percentage: ((otherCount / totalCount) * 100).toFixed(0)
                          });
                      }

                      newChartData[header] = {
                          type: 'string',
                          stringData
                      };
                  }
              }

          });

          setChartData(newChartData);
      }
  }, [csvData]);


    //// folder  (set dropdown)
    const randerTree = (node, currentPath = '') => {
        if (!node) {
            return null
        }

        return (
            <ul className="noneDot">
                {node.map((item, index) => {
                    const path = `${currentPath}/${item.name}`
                    if (item.type === 'folder') {
                        return (
                            <li key={index} className="marBot">
                                <span className="pointer" onClick={() => setOpenFolders(prev => ({ ...prev,[path]: !prev[path] }))}>
                                  <IoMdArrowDropright /> <FaRegFolder /> {item.name}
                                </span>
                                {openFolders[path] && (
                                    <div className="ml-4">
                                       {randerTree(item.contents, path)}
                                    </div>
                                )}
                            </li>
                        )
                    } else if (item.type === 'file') {
                        return (
                            <li key={index} className="pointer" id="marginBot"onClick={() => handleFileClick(path)}>
                              <GrColumns />  {item.name}
                            </li>
                        );
                    }
                    return null;
                })}
            </ul>
        )
    }

    const renderCSVData = () => {
        if (csvData.length === 0) return null;
        const paginatedData = csvData;
        const options = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: {
                  display: false,
              },
              title: {
                  display: true,
              },
          },
          scales: {
              y: {
                  beginAtZero: true,
              }
          }
      };

        return (
          <div>
            <div className="idk">
              <p className="upp">
                <span className="fileName">{selectedFile}</span>
                <span className="fileSize">({fileSize})</span>
              </p>
              <h2>CSV Data</h2>
              <table className="">
                <thead>
                  <tr>
                    {Object.keys(csvData[0]).map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {Object.keys(csvData[0]).map((header, index) => (
                      <td key={index}>
                        {chartData[header]?.type === 'count' ? (
                          <div>
                            <span>
                              {chartData[header].totalCount} total values
                            </span>
                          </div>
                          ) : chartData[header]?.type === 'chart' ? (
                          <div>
                            <Bar options={options} data={chartData[header]} />
                          </div>
                          ) : chartData[header]?.type === 'string' ? (
                          <div>
                            <ul>
                              {chartData[header].stringData.map((item, i) => (
                                <li key={i}>
                                  {item.label}: {item.percentage} %
                                </li>
                              ))}
                            </ul>
                          </div>
                          ) : (
                          <div>
                            <span>Data column</span>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                  {paginatedData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
    };

    const renderMetadata = (dataSet) => {
        let metadata = 'DICOM Metadata:\n';
        if (dataSet.elements) {
            Object.entries(dataSet.elements).forEach(([tag, element]) => {
                let value = 'N/A';
                try {
                    value = dataSet.string(tag) || 'N/A';
                } catch (error) {
                    console.error(`Error retrieving value for tag ${tag}:`, error);
                }

                if (value === '' || value === undefined || value === null) {
                    value = 'N/A (Empty value)';
                } else if (!isPrintable(value)) {
                    value = 'N/A (Non-printable characters)';
                }

                metadata += `${element.name || tag}: ${value}\n`;
            });
        } else {
            metadata += 'No metadata available.\n';
        }
        return metadata;
    };

    const isPrintable = (str) => {
        return /^[\x20-\x7E]*$/.test(str);
    };


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
        <hr className="justLine2"/>
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

        <div className="fileright">
          <p className="FILE">Files</p>
          <p className="file">147320 files</p>

          <p className="FILE">Size</p>
          <p className="file">35.34 GB</p>

          <p className="FILE">Type</p>
          <p className="file">dcm, csv</p>

          <p className="FILE">License</p>
          <p className="file2">Subject to Competition Rules</p>
        </div>
        
        <br/><br/><br/><br/>
        <div>
          <img src={logo} alt="logoRSNA" className="logoRSNA" />
          <span className="top">Radiological Society of North America · Featured Code Competition · 7 days ago</span>
        </div>
        <br/>
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


        <div  className="contain2">
          <div className="onRight">
            <p className="dataEx">Data Explorer</p>
            {files ? randerTree(files) : <p>Loading files...</p>}
          </div>
          <div className="contain3">
            <div>
              <h2>DICOM Image</h2>
              <div id="dicomImage" style={{ width: '512px', height: '512px' }}></div>
            </div>
            {dicomData && (
              <div>
                <h2>DICOM Metadata</h2>
                <pre>{renderMetadata(dicomData)}</pre>
              </div>
            )}
            {csvData.length > 0 && (
              <div>
                {renderCSVData()}
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
