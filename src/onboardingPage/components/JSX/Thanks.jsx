import React from "react";
import "../CSS/Thanks.css";
import icon from "/public/icons/128x128.png";

const Thanks = () => {
  return (
    <div className="container">
      <div className="ad-skipper-mark">
        <img src={icon} id="icon" />
        <p>Ad Skipper</p>
      </div>
      <h1 className="thanks-main-text">Thanks for your support!</h1>
      <p className="thanks-small-text">You may now close this tab.</p>
    </div>
  );
};

export default Thanks;
