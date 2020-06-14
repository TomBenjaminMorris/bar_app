import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/actions";
import "./LandingPage.css";
import { Route, Link } from "react-router-dom";
import { Parallax, Background } from "react-parallax";

import mobileHeader from "../images/tom_hh_2.jpg";
import desktopHeader from "../images/group_1.jpg";
import locationIcon from "../icons/placeholder.png";
import Image from "../../components/Image/Image";
import Preview from "./Preview/Preview";
import HowItWorks from "./HowItWorks/HowItWorks";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import Donation from "./Donation/Donation";

class LandingPage extends Component {
  componentDidMount() {
    this.props.actions.reset();
  }

  render() {
    let barImg = "";
    let showMessage = true;

    const vw = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    if (vw < 650) {
      barImg = mobileHeader;
      showMessage = false;
    } else {
      barImg = desktopHeader;
    }

    return (
      <Route
        render={({ history }) => (
          <div className="wrapperLandingParent">
            <Header history={history} />
            <div className="photosLandingWrapper">
              <Parallax strength={300}>
                <Background className="custom-bg">
                  <Image
                    className="photoLanding"
                    imageLoadedStyle="photoLandingLoaded"
                    src={barImg}
                  />
                </Background>
              </Parallax>
            </div>

            <div className="photosLandingWrapper overlayWrapper">
              <div className="titleDescriptionLandingWrapper">
                <div className="titleDescriptionLanding">
                  Find the best happy hours happening right now.
                </div>
                <div className="supportedAreas">
                  {showMessage && "Locations include:"}
                  <div className="supportedAreasLinks">
                    <Link to={`/map/leeds`}>Leeds</Link>
                    <a>•</a>
                    <Link to={`/map/clapham`}>London - Clapham</Link>
                  </div>
                </div>
                <div className="locationWrapper">
                  <div className="searchBarLandingWrapper">
                    <Link to={`/map`}>Search...</Link>
                  </div>
                  <div className="currentLocationLanding">
                    <Link to={`/map`}>
                      <img alt="location icon" src={locationIcon} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Preview />
            <HowItWorks />
            <Link to={`/map`}>
              {" "}
              <button className="CheckItOutButton">Try For Free</button>
            </Link>
            {/* <Donation /> */}
            <Footer />
          </div>
        )}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
