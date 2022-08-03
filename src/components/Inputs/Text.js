import React from "react";

const Text = ({ placeholder, type, name, icon, nameChange }) => {

  return (
    <div className="input-group mb-3 border-bottom">
      <input
        className="form-control border-0"
        placeholder={placeholder}
        type={type}
        name={name}
        onChange={ e => nameChange(e.target.value)}
      />
      <div className="input-group-append">
        <span className="input-group-text bg-none border-0" id="basic-addon2">
          <span className={icon}></span>
        </span>
      </div>
    </div>
  );
};

export default Text;
