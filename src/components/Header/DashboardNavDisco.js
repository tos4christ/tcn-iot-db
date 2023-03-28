import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import logo from "../../assets/img/logo.JPG";
import rlogo from "../../assets/img/responderLogo.JPG";

const DashboardNavUser = ({ company, body }) => {
  const history = useHistory();
  const [toggle, setToggle] = useState(false);
  const route = history.location.pathname;

  const changeToggle = () => {
    if (!toggle) {
      openNav();
      setToggle((prevState) => !prevState);
    } else {
      closeNav();
      setToggle((prevState) => !prevState);
    }
  };
  /* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }
  /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
  }
  return (
    <div>
      <div id="mySidenav" className="sidenav">
        <div className="text-center">
          {/* <img src={logo} alt="logo" /> */}
          <img
            src={rlogo}
            alt="r-logo"
            className="rounded-circle my-2 r-logo"
          />
          <div className="mx-auto" style={{ width: 190 }}>
            <h5 className="text-dark font-weight-bold">{company}</h5>
          </div>
        </div>
        <div className="bg-light mt-4">
          <a
            className={route === "/api/tickets/disco/new" ? "active" : ""}
            href="/api/tickets/disco/new"
          >
            <span className="fa fa-user"></span> New Ticket
          </a>
          <a
            className={route === "/api/tickets/disco/tickets" ? "active" : ""}
            href="/api/tickets/disco/tickets"
          >
            {" "}
            <span className="fa fa-car"></span> View Tickets
          </a>
          <a href="/">
            {" "}
            <span className="fa fa-sign-out"> </span> Logout
          </a>
        </div>
      </div>
      {/* <!-- Use any element to open the sidenav --> */}
      {/* <!-- Add all page content inside this div if you want the side nav to push page content to the right (not used if you only want the sidenav to sit on top of the page --> */}
      <div id="main" className="bg-light">
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow">
          <div className="text-secondary toggle">
            <a href="#main" onClick={() => changeToggle()}>
              <h1>
                <span className="fa fa-bars"></span>
              </h1>
            </a>
          </div>
          <div
            className="mr-auto d-flex pl-3"
            id="navbarSupportedContent"
            style={{ width: 200 }}
          >
            <h3 className="">Users Dashboard</h3>
          </div>
          <div>
            {/* former button area */}
            <span id="display"></span>
          </div>
          <div className="ml-auto d-flex " id="navbarSupportedContent">
            <a href="#main">
              <h2>
                <span className="fa fa-bell mr-4 text-secondary"></span>
              </h2>
            </a>
            <a href="#main">
              <h2>
                <span className="fa fa-envelope mr-4 text-secondary"></span>
              </h2>
            </a>
            <a href="#main">
              <h2>
                <span className="fa fa-gear text-secondary"></span>
              </h2>
            </a>
          </div>
        </nav>
        {body}
      </div>
      ;
    </div>
  );
};

export default DashboardNavUser;
