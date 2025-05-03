import React from "react";

const FeederCard = ({ name, isOn, display = "flex" }) => {
  return (
    <div
      style={{
        display: display,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px",
        width: "200px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: isOn ? "#d4edda" : "#f8d7da",
        color: isOn ? "#155724" : "#721c24",
      }}
    >
      <span>{name}</span>
      <span style={{ fontSize: "20px" }}>
        {isOn ? "🟢" : "🔴"}
      </span>
    </div>
  );
};

export default FeederCard;