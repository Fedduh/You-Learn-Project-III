import React, { Component } from "react";
import AuthService from "../services/AuthService";
import ErrorMessage from "./ErrorMessage";

class Login extends Component {
  state = {
    username: "",
    password: "",
    error: null
  };

  changeHandler = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  handleFormSubmit = e => {
    e.preventDefault();
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
  };
 

  authService = new AuthService();

  render() {
    return (
      <div id="login-form">
        {this.state.error && <ErrorMessage error={this.state.error} />}
        <h2>log in</h2>
        <form onSubmit={this.handleFormSubmit}>
          <label>*username</label>
          <input
            type="text"
            name="username"
            required={true}
            autoComplete="current-username"
            value={this.state.username}
            onChange={this.changeHandler}
          />
          <label>*password</label>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={this.state.password}
            onChange={this.changeHandler}
          />
          <button type="submit">Log in</button>
        </form>
        <div className="buttonOne" onClick={this.props.setNewUser}>New user?</div>
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
