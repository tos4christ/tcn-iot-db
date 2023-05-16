import React from "react";
const style = {
  marginTop: "90px",
  marginBottom: "-50px",
};
const Footer = () => {
  return (
    <div style={style} className="copyright-area">
      <p>
        Copyright &copy;
        {new Date().getFullYear()} | This web app is made with{" "}
        <i className="fa fa-heart-o" aria-hidden="true"></i> by Team-003
      </p>
    </div>
  );
};

export default Footer;
