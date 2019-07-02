import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/AuthService.js";

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
        <Link to="/">home</Link>
        <Link to="/create">create</Link>
        {this.props.currentUser ? (
          <div>
            <Link to="/">profile</Link>
          </div>
        ) : (
          <div>
            <Link to="/">login</Link>
          </div>
        )}
        {this.props.currentUser && (
          <Link to="/" onClick={this.logoutUser}>
            logout
          </Link>
        )}
      </header>
    );
  }
}

export default Header;
