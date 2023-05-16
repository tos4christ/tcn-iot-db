import React from "react";

const Button = ({ text, show, onClick, id }) => {
  return (
    <div className="lower-btn">
      <button
        className={`btn mb-0 bg-success text-light px2 py-2 ${show}`}
        type="submit"
        onClick={onClick}
        id={id}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
