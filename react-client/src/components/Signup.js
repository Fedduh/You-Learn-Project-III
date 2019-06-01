import React, { Component } from "react";
import AuthService from "../auth/AuthService";

class Signup extends Component {
  state = {
    username: "",
    password: "",
    email: ""
  };

  authService = new AuthService();

  changeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleFormSubmit = e => {
    e.preventDefault(); 
    this.authService
      .signup(this.state.username, this.state.password, this.state.email)
      .then(response => {
        console.log(response);
      });
  };

  render() {
    return (
      <div>
        <h2>Signup page</h2>
        <form onSubmit={this.handleFormSubmit}>
          <label>Username</label>
          <input type="text" name="username" onChange={this.changeHandler} />
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={this.changeHandler}
          />
          <label>Email</label>
          <input type="email" name="email" onChange={this.changeHandler} />
          <button type="submit">Sign up</button>
        </form>
      </div>
    );
  }
}

export default Signup;
