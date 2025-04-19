import React, { useState } from 'react';
import '../css/DragDropPage.css';
import {BallTriangle} from 'react-loader-spinner';

function DragDropPage() {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadedName, setUploadedName] = useState(null);
  
    // Handle drag enter
    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };
  
    // Handle drag over
    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
  
    // Handle drag leave
    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };
  
    // Process a single file system entry (file or directory)
    const processEntry = async (entry, files) => {
      if (entry.isFile) {
        const file = await new Promise((resolve) => entry.file(resolve));
        files.push(file); // Collect all files from folders
      } else if (entry.isDirectory) {
        const dirReader = entry.createReader();
        const entries = await new Promise((resolve) => dirReader.readEntries(resolve));
        for (let subEntry of entries) {
          await processEntry(subEntry, files); // Recursively process directory contents
        }
      }
    };
  
    // Handle drop
    const handleDrop = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setIsLoading(true);
  
      const items = e.dataTransfer.items;
      console.log(items);
      const files = [];
      let name = null;
  
      // Process all dropped items
      for (let item of items) {
        if (item.webkitGetAsEntry) {
          const entry = item.webkitGetAsEntry();
          if (entry.isDirectory) {
            name = entry.name; // Capture folder name
            await processEntry(entry, files); // Process folders (all files inside)
          } else if (entry.isFile) {
            const file = await new Promise((resolve) => entry.file(resolve));
            if (file.name.endsWith('.zip')) {
              files.push(file); // Only accept .zip files for individual drops
              name = name || file.name; // Use zip name if no folder
            }
          }
        } else {
          const file = item.getAsFile();
          if (file && file.name.endsWith('.zip')) {
            files.push(file); // Only accept .zip files for individual drops
            name = name || file.name; // Use zip name if no folder
          }
        }
      }
  
      setSelectedFiles(files);
      setUploadedName(name);
      setIsLoading(false);
    };
  
    // Handle file input change (when clicking to select files)
    const handleFileInputChange = async (e) => {
      setIsLoading(true);
      const file = e.target;
      console.log(file);
      const files = Array.from(e.target.files);
      console.log(files);
      const zipFiles = files.filter((file) => file.name.endsWith('.zip'));
      let name = null;
  
      // Check if a folder was selected (webkitRelativePath includes folder structure)
      if (files.length > 0 && files[0].webkitRelativePath) {
        const folderPath = files[0].webkitRelativePath.split('/')[0];
        name = folderPath; // Use folder name
      } else if (zipFiles.length > 0) {
        name = zipFiles[0].name; // Use zip file name
      }
  
      setSelectedFiles(files.length > zipFiles.length ? files : zipFiles); // Use all files for folder, else only zip
      setUploadedName(name);
      setIsLoading(false);
    };
  
    // Handle filter button click (placeholder)
    const handleFilterClick = () => {
      alert('Filtering images... (Functionality to be implemented)');
    };
  
    // Reset to initial state
    const handleReset = () => {
      setSelectedFiles([]);
      setUploadedName(null);
      setIsLoading(false);
    };

  return (
    <>
   
    <div className="unzip-container">
    <h1 style={{color: "white", fontSize: "40px", textAlign: "center"}}>Free Online Face Filter</h1>
    <br/>
    <p style={{color: "white", fontSize: "20px", textAlign: "center"}}>Upload and filter your face among others online.</p>
      <div className="content-container">
        <label
          htmlFor="fileInput"
          className={`drop-zone ${isDragging ? 'active' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isLoading ? (
            <BallTriangle
            height={100}
            width={100}
            radius={5}
            color="#10b981"
            ariaLabel="ball-triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            />
          ) : uploadedName ? (
            <div className="uploaded-content">
              <div className="folder-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <span>{uploadedName}</span>
              <button className="reset-button" onClick={handleReset}>
                Change folder/zip
              </button>
            </div>
          ) : (
            <>
              Drag folder or zip file here or click to select
              <input
                type="file"
                multiple
                accept=".zip"
                onChange={handleFileInputChange}
                id="fileInput"
                style={{ display: 'none' }}
                webkitdirectory="true" // Allows folder selection
              />
            </>
          )}
          {/* <input
            type="file"
            multiple
            accept="image/*,.zip"
            onChange={handleFileInputChange}
            id="fileInput"
            style={{ display: 'none' }}
            webkitdirectory="true" // Allows folder selection
          /> */}
        </label>
        {selectedFiles.length > 0 && (
          <p className="file-count">{selectedFiles.length} files selected</p>
        )}
        <button
          className="filter-button"
          disabled={selectedFiles.length === 0}
          onClick={handleFilterClick}
        >
          Filter your images
        </button>
      </div>
    </div>
    </>
  );
}

export default DragDropPage;