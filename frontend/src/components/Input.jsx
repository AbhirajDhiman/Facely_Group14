import React from 'react';
import '../css/Input.css';

const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="input-container">
      <div className="input-icon-wrapper">
        <Icon className="input-icon" />
      </div>
      <input
        {...props}
        className="input-field"
      />
    </div>
  );
};

export default Input;