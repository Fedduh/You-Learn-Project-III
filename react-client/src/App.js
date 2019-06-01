import React, { Component } from "react";
import Header from "./components/Header.js";
import Login from "./components/Login.js";
import Signup from "./components/Signup.js";

import { Switch, Route } from "react-router-dom";

import "./App.css";

class App extends Component {
  state = {
    currentUser: null
  }

  setCurrentUser = username => {
    this.setState({
      currentUser: username
    })
  }
 
  render() {
    return (
      <div className="App">
        <Header setCurrentUser={this.setCurrentUser} />
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
        </Switch>
      </div>
    );
  }
}

export default App;
