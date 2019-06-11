import React, { Component } from "react";
import { Link } from "react-router-dom";
import ElearningService from "../services/ElearningService";
import AuthService from "../services/AuthService";

import CreateElearning from "./CreateElearning";

class CreateOverview extends Component {
  state = {
    elearnings: null,
    currentUser: null,
    message: null,
    newElearning: false
  };

  elearningService = new ElearningService();
  authService = new AuthService();

  // componentDidMount() {
  //   this.authService.isLoggedIn()
  //     .then(user => {
  //       console.log('USER', user);
  //       if(user === undefined) {

  //         return;
  //       }
  //       console.log('test')
  //       this.setState({currentUser: user})
  //       this.setElearnings();
  //     })
  //     .catch(err => {
  //       console.log('error', err);
  //     })
  // }

  componentDidMount() {
    console.log("did mount", this.props.currentUser);
    this.setState({ currentUser: this.props.currentUser });
    this.setElearnings();
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log('received props', this.props.currentUser)
  //   this.setState({ currentUser: this.props.currentUser });
  //   this.setElearnings();
  // }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.currentUser !== prevProps.currentUser) {
      console.log("did update", this.props.currentUser);
      this.setState({
        currentUser: this.props.currentUser
      });
      this.setElearnings();
    }
  }

  setElearnings = () => {
    this.elearningService.getCreatedByUser().then(elearnings => {
      this.setState({ elearnings: elearnings });
    });
  };

  showCreateNew = () => {
    this.setState({
      newElearning: true
    });
  };

  render() {
    return (
      <section>
        <h2>E-learning modules created by you</h2>
        {this.state.elearnings &&
          this.state.elearnings.map(elearning => {
            return (
              <div key={elearning._id}>
                <h3>{elearning.title}</h3>
                <Link to={`/create/${elearning._id}`}>edit</Link>
              </div>
            );
          })}
        <div className="buttonOne" onClick={this.showCreateNew}>
          Create new e-learning module
        </div>

        {this.state.newElearning && <CreateElearning />}
      </section>
    );
  }
}

export default CreateOverview;
