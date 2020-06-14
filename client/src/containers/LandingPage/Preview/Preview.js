import React from "react";
import "./Preview.css";
import LaptopMobileCombo from "../../images/laptop_iphone_combo-min.png";
import Image from "../../../components/Image/Image";

const preview = () => {
  return (
    <div className="PreviewWrapper">
      <div className="Preview">
        <div className="row">
          <div className="column">
            <div className="PreviewText">
              <div>A simple app that gets right to the point</div>
              <p>
                The closest happy hours are displayed on a map with deals that
                are easy to read and compare. No more endless clicking and
                scrolling while trying to find what you actually came for.
              </p>
            </div>
          </div>
          <div className="double-column">
            <div className="PreviewImages">
              <Image
                className="ComboImage"
                src={LaptopMobileCombo}
                alt="Laptop and Mobile Application"
              />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="PreviewCurve"></div> */}
    </div>
  );
};

export default preview;
