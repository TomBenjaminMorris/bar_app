import React from "react";
import "./Image.css";
import ViewportObserver from "../ViewportObserver/ViewportObserver";

class Image extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageLoading: true,
    };
  }

  render() {
    const { src, className, imageLoadedStyle, noLazyLoad, alt } = this.props;
    const imageLoaded = !this.state.imageLoading
      ? imageLoadedStyle || "imgLoaded"
      : "";

    return (
      <div className={`imgSkeleton ${className}`}>
        <ViewportObserver>
          {(intersected) => {
            const loadImage = intersected || noLazyLoad;
            return (
              loadImage && (
                <img
                  src={src}
                  className={`img ${imageLoaded} ${className}`}
                  alt={alt || ""}
                  onLoad={() => {
                    this.setState({ imageLoading: false });
                  }}
                />
              )
            );
          }}
        </ViewportObserver>
      </div>
    );
  }
}

export class ImageWithBlur extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageLoading: true,
    };
  }

  render() {
    const { src, className, imageLoadedStyle, blurClassNames } = this.props;
    const imageLoaded = !this.state.imageLoading
      ? imageLoadedStyle || "imgLoaded"
      : "";
    const { blurImage, mainImage, container } = blurClassNames || {};

    return (
      <div className={`imgSkeleton ${className}`}>
        <ViewportObserver>
          {(intersected) => {
            return (
              intersected && (
                <div className={`BlurImgContainer ${container}`}>
                  <img
                    src={src}
                    className={`img ${imageLoaded} blurImage ${blurImage}`}
                    alt=""
                    onLoad={() => {
                      this.setState({ imageLoading: false });
                    }}
                  />
                  <img
                    src={src}
                    className={`img ${imageLoaded} blurMainImage ${mainImage}`}
                    alt=""
                    onLoad={() => {
                      this.setState({ imageLoading: false });
                    }}
                  />
                </div>
              )
            );
          }}
        </ViewportObserver>
      </div>
    );
  }
}

export default Image;
