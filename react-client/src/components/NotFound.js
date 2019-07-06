import React from "react";
import errorImg from "../images/404img.jpg";

const NotFound = props => {
  return (
    <div>
      <h2>404 - not found</h2>
      <img className="error-img" src={errorImg} alt="error" />
    </div>
  );
};

export default NotFound;
