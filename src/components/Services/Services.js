import React from "react";
import { Element } from "react-scroll";

const Services = () => {
  return (
    <Element id="HIW" name="HIW">
      <section className="about-area ptb-90">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="sec-title">
                <h2>
                  How It Works
                  <span className="sec-title-border">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </h2>
                <p>RoadMaster is users' friendly. Its safe and easy to use.</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <div className="single-about-box">
                <i className="icofont icofont-ruler-pencil"></i>
                <h4>Report an event</h4>
                <p>
                  Our carefully designed stress-free form gives accident victims
                  / eyewitnesses the opportunity to report casualities of any
                  form.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="single-about-box active">
                <i className="icofont icofont-computer"></i>
                <h4>We contact the concerned units</h4>
                <p>
                  On our part, we notify all emergncy and security units within
                  the reported area and request for their prompt actions.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="single-about-box">
                <i className="icofont icofont-headphone-alt"></i>
                <h4>We suggest alternative routes</h4>
                <p>
                  Our Artificial Inteligence calculates the shortest alternative
                  routes and notify other users in real time. This helps in
                  reducing unnecessary traffic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Element>
  );
};

export default Services;
