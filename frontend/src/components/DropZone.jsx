import React, { useState } from 'react';
import { BallTriangle } from 'react-loader-spinner';
import '../css/DragDropPage.css';

const DropZone = ({
  id,
  accept,
  multiple,
  handleFileInputChange,
  handleDrop,
  isLoading,
  isUploaded,
  renderUploadedContent,
  defaultMessage,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDropLocal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleDrop(e);
  };

  return (
    <label
      htmlFor={id}
      className={`drop-zone ${isDragging ? 'active' : ''}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDropLocal}
    >
      {isLoading ? (
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#10b981"
          ariaLabel="ball-triangle-loading"
          visible={true}
        />
      ) : isUploaded ? (
        renderUploadedContent()
      ) : (
        defaultMessage
      )}
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInputChange}
        id={id}
        style={{ display: 'none' }}
      />
    </label>
  );
};

export default DropZone;