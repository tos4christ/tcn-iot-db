import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import logo from "../../assets/img/logo.JPG";
import rlogo from "../../assets/img/responderLogo.JPG";
//import socket from "../../utility/socketioConnection";
//import emergencyAlert from "../../assets/audio/emergency_alert.mp3";
import $ from "jquery";
import 'popper.js/dist/popper';
import 'bootstrap/dist/js/bootstrap.bundle';

const DashboardNav = ({ body }) => {
  const history = useHistory();
  const [toggle, setToggle] = useState(false);
  let [location, setLocation] = useState("");
  let [bloodType, setBloodType] = useState("");
  let [genotype, setGenoType] = useState("");
  let [nextOfKinNum, setNextOfKinNum] = useState("");
  let [emNUm, setEmNum] = useState("");
  let [Killnessess, setKIllnesses] = useState("");
  let [resAdd, setResAdd] = useState("");
  let [name, setName] = useState("");
  const route = history.location.pathname;
  // const audio = new Audio(emergencyAlert);

  // function to display when the reply gets back
  const sosAlert =  function(data) {
    const { user, accidentLocation } = data;
    const loc = `lat: ${accidentLocation.lat} , lon: ${accidentLocation.lon}`;
    setLocation(loc);
    setBloodType(user.bloodType);
    setGenoType(user.genotype);
    setNextOfKinNum(user.nextofkinNum);
    setEmNum(user.emergencyNum);
    setKIllnesses(user.knownIllnesses);
    setResAdd(user.residentialAdd);
    setName(user.name);
    //audio.play();
    $("#myModal").modal({
      keyboard: true
    })
    $("#myModal").modal("show");
  };

  // socket.io implementation
  //const unitName = localStorage.getItem("nameOfUnit");
  //socket.on(unitName, sosAlert);

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
      <button style={{display: "none"}} type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">
          Open modal
      </button>
      <div class="modal" id="myModal">
        <div class="modal-dialog">
          <div class="modal-content">          
            <div class="modal-header">
              <h4 class="modal-title">Dear Responder</h4>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
              <p>There is an accident at this location: <a href="#main"> {location}</a></p>
              <h3> Victim details below</h3>
              <div>
              <p>Name: {name}</p>
              <p>Blood type: {bloodType}</p>
              <p>Genotype: {genotype}</p>
              <p>Next of kin phone: {nextOfKinNum}</p>
              <p>Emergency phone: {emNUm}</p>
              <p>Known Illnessess: {Killnessess[0]}</p>
              <p>Residential address: {resAdd}</p>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
            </div>
            <button className="btn btn-success" onClick={() => {}}>
            Accept Alarms
          </button>
          </div>
        </div>
      </div>
      <div id="mySidenav" className="sidenav">
        <div className="text-center">
          <img src={logo} alt="logo" />
          <img
            src={rlogo}
            alt="r-logo"
            className="rounded-circle my-2 r-logo"
          />
          <div className="mx-auto" style={{ width: 100 }}>
            <h5 className="text-dark font-weight-bold">
              Ikoyi Fire Service Unit
            </h5>
          </div>
        </div>
        <div className="bg-light mt-4">
          <a
            className={route === "/dashboard" ? "active" : ""}
            href="/dashboard"
          >
            <span className="fa fa-user"></span> Dashboard
          </a>
          <a className={route === "/crashes" ? "active" : ""} href="/crashes">
            {" "}
            <span className="fa fa-car"></span> Crashes
          </a>
          <a className={route === "/reports" ? "active" : ""} href="/reports">
            {" "}
            <span className="fa fa-institution"></span> Reports{" "}
            <span className="text-danger">(1)</span>
          </a>
          <a href="#main">
            {" "}
            <span className="fa fa-list"> </span> Summary
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
            <h3 className="">Responders Dashboard</h3>
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

export default DashboardNav;
