import React from "react";
import { Link } from "react-router-dom";

const Header = props => {
  return (
    <header>
      <div>Header</div>
      <div>
        <Link to="/login">Login</Link>
      </div>
      <div>
        <Link to="/signup">Signup</Link>
      </div>
    </header>
  );
};

export default Header;
