import React from "react";
import logo from "../images/logo.png"

const Footer = props => {
  return (
    <footer>
      <img src={logo} alt="youlearn logo" className="logo-img" />
      <p>
        made by{" "}
        <a rel="noopener noreferrer" href="https://www.linkedin.com/in/feddetilma/" target="_blank">
          fedde
        </a>
      </p>
    </footer>
  );
};

export default Footer;
