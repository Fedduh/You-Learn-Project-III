import React, { Component } from "react";
import AuthService from "../services/AuthService";
import ErrorMessage from "./ErrorMessage.js";

// needed to access history object within props in this component
import { withRouter } from "react-router-dom";

class Signup extends Component {
  state = {
    username: "",
    password: "",
    email: "",
    error: null
  };

  authService = new AuthService();

  changeHandler = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  handleFormSubmit = e => {
    e.preventDefault();
    this.authService
      .signup(this.state.username, this.state.password, this.state.email)
      .then(response => {
        console.log(response);
        if (response.message) {
          this.setState({ error: response.message });
          return;
        } else { 
          // login + redirect to home page when successful
          this.authService
            .login(this.state.username, this.state.password)
            .then(response => {
              if (response.message) {
                this.setState({ error: response.message });
                return;
              } 
              this.props.setCurrentUser(response.username);
              // this.props.history.push("/");
            });
        }
      });
  };

  render() {
    return (
      <div id="signup-form"> 
        {this.state.error && <ErrorMessage error={this.state.error} />}
        <h2>sign up</h2>
        <form onSubmit={this.handleFormSubmit}>
          <label>*username</label>
          <input
            type="text"
            name="username"
            required={true}
            autoComplete="new-username"
            value={this.state.username}
            onChange={this.changeHandler}
          />
          <label>*password</label>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            value={this.state.password}
            onChange={this.changeHandler}
          />
          <label>*e-mail</label>
          <input
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.changeHandler}
          />
          <button type="submit">Sign up</button>
        </form>
        <div className="buttonOne" onClick={this.props.setNewUser}>Already have an account?</div>
      </div>
    );
  }
}

export default withRouter(Signup);
