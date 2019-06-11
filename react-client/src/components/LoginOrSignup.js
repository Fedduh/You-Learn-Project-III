import React, { Component } from "react";
import Login from "./Login.js";
import Signup from "./Signup.js";

class LoginOrSignup extends Component {
  state = {
    newUser: false
  };

  setNewUser = () => {
    console.log('ok')
    const newState = this.state.newUser ? false : true;
    this.setState({
      newUser: newState
    });
  };

  render() {
    return (
      <section className="signup-login-container">
        {this.state.newUser ? (
          <Signup
            setCurrentUser={this.props.setCurrentUser}
            setNewUser={this.setNewUser}
          />
        ) : (
          <Login
            setCurrentUser={this.props.setCurrentUser}
            setNewUser={this.setNewUser}
          />
        )}
      </section>
    );
  }
}

export default LoginOrSignup;
