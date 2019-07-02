import React, { Component } from "react";
import AuthService from "../services/AuthService";
import ErrorMessage from "./ErrorMessage.js";
import PasswordShower from "./PasswordShower";

// needed to access history object within props in this component
import { withRouter } from "react-router-dom";

class Signup extends Component {
  state = {
    username: "",
    password: "",
    email: "",
    showPassWord: "password",
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
    this.authService.signup(this.state.username, this.state.password, this.state.email).then(response => {
      console.log(response);
      if (response.message) {
        this.setState({ error: response.message });
        return;
      } else {
        // login + redirect to home page when successful
        this.authService.login(this.state.username, this.state.password).then(response => {
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

  showPassWordChange = () => { 
    var newState = this.state.showPassWord === "password" ? "text" : "password";
    this.setState({
      showPassWord: newState
    });
  };

  render() {
    return (
      <div id="signup-form">
        {this.state.error && <ErrorMessage error={this.state.error} />}
        <h2>sign up</h2>
        <form onSubmit={this.handleFormSubmit}>
          <label>username*</label>
          <input
            type="text"
            name="username"
            required={true}
            autoComplete="new-username"
            value={this.state.username}
            onChange={this.changeHandler}
          />
          <PasswordShower text="password*" show={this.state.showPassWord} onClick={this.showPassWordChange} />
          <input
            type={this.state.showPassWord}
            name="password"
            required={true}
            autoComplete="new-password"
            value={this.state.password}
            onChange={this.changeHandler}
          />
          <label>e-mail*</label>
          <input
            type="email"
            name="email"
            required={true}
            value={this.state.email}
            onChange={this.changeHandler}
          />
          <button className="buttonOne" type="submit">
            Sign up
          </button>
          <button className="buttonOne" onClick={this.props.setNewUser}>
            Already have an account?
          </button>
        </form>
      </div>
    );
  }
}

export default withRouter(Signup);
