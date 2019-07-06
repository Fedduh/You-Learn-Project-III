import React, { Component } from "react";
import AuthService from "../services/AuthService";
import ErrorMessage from "./ErrorMessage";
import PasswordShower from "./PasswordShower";

class Login extends Component {
  state = {
    username: "",
    password: "",
    error: null,
    showPassWord: "password"
  };

  changeHandler = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  handleFormSubmit = e => {
    e.preventDefault();
    this.authService.login(this.state.username, this.state.password).then(response => {
      if (response.message) {
        this.setState({ error: response.message });
        return;
      }
      this.props.setCurrentUser(response.username);
      // this.props.history.push("/");
    });
  };

  showPassWordChange = () => {
    var newState = this.state.showPassWord === "password" ? "text" : "password";
    this.setState({
      showPassWord: newState
    });
  };

  authService = new AuthService();

  render() {
    return (
      <div id="login-form">
        {this.state.error && <ErrorMessage error={this.state.error} />}
        <h2>login</h2>
        <form onSubmit={this.handleFormSubmit}>
          <label>username</label>
          <input
            type="text"
            name="username"
            required={true}
            autoComplete="current-username"
            value={this.state.username}
            onChange={this.changeHandler}
          />

          <PasswordShower text="password" show={this.state.showPassWord} onClick={this.showPassWordChange} />

          <input
            type={this.state.showPassWord}
            name="password"
            autoComplete="current-password"
            required={true}
            value={this.state.password}
            onChange={this.changeHandler}
          />

          <button className="buttonOne buttonGreen" type="submit">
            log in
          </button>
          <button className="buttonOne" onClick={this.props.setNewUser}>
            register as new user
          </button>
        </form>
      </div>
    );
  }
}

export default Login;

// componentDidUpdate(prevProps) {
//   // Typical usage (don't forget to compare props):
//   if (this.props.currentUser !== prevProps.currentUser) {
//     this.setState({
//       username: this.props.currentUser
//     });
//   }
// }
