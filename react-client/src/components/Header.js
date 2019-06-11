import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/AuthService.js";
import "./Header.css";

class Header extends Component {
  authService = new AuthService();

  logoutUser = () => {
    this.authService.logout().then(result => {
      this.props.logoutUser();
    });
  };

  render() {
    return (
      <header>
        <Link to="/">Modules</Link>
        {this.props.currentUser ? (
          <div>
            <Link to="/create">Create</Link>
            <Link to="/" onClick={this.logoutUser}>
              Logout
            </Link>
            <Link to="/">Profile</Link>
          </div>
        ) : (
          <div>
            {/* <Link to="#signup-form">Signup</Link> */}
            <Link to="/">Login</Link>
          </div>
        )}
      </header>
    );
  }
}

export default Header;
