import React, { Component } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginOrSignup from "./components/LoginOrSignup";
import AuthService from "./services/AuthService";
import Profile from "./components/Profile";
import ElearningOverview from "./components/ElearningOverview";
import CreateOverview from "./components/CreateOverview";
import EditElearning from "./components/EditElearning";
import PlayElearning from "./components/PlayElearning";
import NotFound from "./components/NotFound";

import { Switch, Route } from "react-router-dom";

import "./App.css";

class App extends Component {
  state = {
    currentUser: null
  };

  authService = new AuthService();

  // refresh state if user is logged in with session cookie
  componentDidMount() {
    if (this.state.currentUser === null) {
      this.fetchUser();
    }
  }

  fetchUser = () => {
    this.authService
      .isLoggedIn()
      .then(response => {
        this.setState({ currentUser: response });
      })
      .catch(err => {
        this.setState({ currentUser: null });
      });
  };

  // set user state after login / sign up
  setCurrentUser = username => {
    this.setState({
      currentUser: username
    });
  };

  logoutUser = () => {
    this.setState({
      currentUser: null
    });
  };

  render() {
    return (
      <div className="App">
        <Header currentUser={this.state.currentUser} logoutUser={this.logoutUser} />

        {/* !! START CONTENT */}
        <div className="content">
          <Switch>
            {/* Main content - signup / profile / overview / play / notfound */}
            <Route
              exact
              path="/"
              render={() => (
                <div>
                  {this.state.currentUser && (
                    <section className="profile-container">
                      <Profile currentUser={this.state.currentUser} />
                    </section>
                  )}
                  {!this.state.currentUser && <LoginOrSignup setCurrentUser={this.setCurrentUser} />}
                  <ElearningOverview />
                </div>
              )}
            />
            {/* Main content - end */}

            {/* Create - start */}
            <Route
              exact
              path="/create"
              render={() => (
                <CreateOverview currentUser={this.state.currentUser} setCurrentUser={this.setCurrentUser} />
              )}
            />
            <Route
              exact
              path="/create/:id"
              // pass id from match in props
              render={({ match }) => (
                <EditElearning currentUser={this.state.currentUser} id={match.params.id} />
              )}
            />
            {/* Create - end */}

            {/* Play -start */}
            <Route
              exact
              path="/play/:id"
              // pass elearning-id from match in props
              render={({ match }) => (
                <PlayElearning
                  currentUser={this.state.currentUser}
                  id={match.params.id}
                  setCurrentUser={this.setCurrentUser}
                />
              )}
            />
            {/* Play - end */}

            {/* 404 - start*/}
            <Route path="*" component={NotFound} />
            {/* 404 - end*/}

          </Switch>
        </div>
        {/* !! END CONTENT */}

        <Footer />
      </div>
    );
  }
}

export default App;
