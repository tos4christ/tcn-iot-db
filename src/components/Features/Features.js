import React from "react";
import Footer from "../Footer/Footer";
import { Element } from "react-scroll";
import feature from "../../assets/img/feature.png";

const Features = () => {
  return (
    <Element id="features" name="features">
      <section className="feature-area ptb-90" id="feature">
        <div className="container">
          <div className="sec-title">
            <h2 className="text-light">Features</h2>
          </div>
          <div className="row flexbox-center">
            <div className="col-lg-4">
              <div className="single-feature-box text-lg-right text-center">
                <ul>
                  <li>
                    <div className="feature-box-info">
                      <h4>Easy to Use</h4>
                    </div>
                    <div className="feature-box-icon">
                      <i className="icofont icofont-brush"></i>
                    </div>
                  </li>
                  <li>
                    <div className="feature-box-info">
                      <h4>Responsive Design</h4>
                    </div>
                    <div className="feature-box-icon">
                      <i className="icofont icofont-computer"></i>
                    </div>
                  </li>
                  <li>
                    <div className="feature-box-info">
                      <h4>Well Documented</h4>
                    </div>
                    <div className="feature-box-icon">
                      <i className="icofont icofont-law-document"></i>
                    </div>
                  </li>
                  <li>
                    <div className="feature-box-info">
                      <h4>Light Weight</h4>
                    </div>
                    <div className="feature-box-icon">
                      <i className="icofont icofont-heart-beat"></i>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="single-feature-box text-center jump">
                <img src={feature} alt="feature" />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="single-feature-box text-lg-left text-center">
                <ul>
                  <li>
                    <div className="feature-box-icon">
                      <i className="icofont icofont-eye"></i>
                    </div>
                    <div className="feature-box-info">
                      <h4>Night Mode</h4>
                    </div>
                  </li>
                  <li>
                    <div className="feature-box-icon">
                      <i className="icofont icofont-sun-alt"></i>
                    </div>
                    <div className="feature-box-info">
                      <h4>Works Offline</h4>
                    </div>
                  </li>
                  <li>
                    <div className="feature-box-icon">
                      <i className="icofont icofont-code-alt"></i>
                    </div>
                    <div className="feature-box-info">
                      <h4>Real Time Updates</h4>
                    </div>
                  </li>
                  <li>
                    <div className="feature-box-icon">
                      <i className="icofont icofont-headphone-alt"></i>
                    </div>
                    <div className="feature-box-info">
                      <h4>Open to Feedbacks</h4>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </Element>
  );
};

export default Features;
