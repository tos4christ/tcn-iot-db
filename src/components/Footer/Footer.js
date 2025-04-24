import React from "react";
const style = {  
  position: "relative",
  color: "#fff",
  backgroundColor: "#000",
  textAlign: "center",
  padding: "10px 0px 5px 0px",
};
const Footer = () => {
  return (
    <div style={style} className="">
      <p>
        Copyright &copy;
        {new Date().getFullYear()} TCN
        All Rights Reserved  | Powered by GNZTRADES
      </p>
    </div>
  );
};

export default Footer;
