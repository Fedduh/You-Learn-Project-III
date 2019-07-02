import React, { Component } from "react";
import { Link } from "react-router-dom";
import ElearningService from "../services/ElearningService";
import AuthService from "../services/AuthService";

import ErrorMessage from "./ErrorMessage";
import LoginOrSignup from "./LoginOrSignup";
import CreateElearning from "./CreateElearning";
import DeleteConfirmation from "./DeleteConfirmation";

class CreateOverview extends Component {
  state = {
    elearnings: null,
    currentUser: null,
    message: null,
    newElearning: false,
    error: null,
    moduleToDelete: null
  };

  elearningService = new ElearningService();
  authService = new AuthService();

  componentDidMount() {
    this.setElearnings();
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.currentUser !== prevProps.currentUser) {
      this.setElearnings();
    }
  }

  setElearnings = () => {
    this.setState({ currentUser: this.props.currentUser });
    this.elearningService.getCreatedByUser().then(elearnings => {
      if (elearnings.message) {
        this.setState({ error: elearnings.message });
        return;
      }
      this.setState({ elearnings: elearnings });
      this.setState({ error: null });
    });
  };

  showCreateNew = () => {
    this.setState({
      newElearning: true
    });
  };

  deleteModuleCheck = elearning => {
    this.setState({ moduleToDelete: elearning });
  };

  deleteModuleNo = () => {
    this.setState({ moduleToDelete: null });
  };

  deleteModuleYes = () => { 
    this.elearningService.deleteModule(this.state.moduleToDelete._id).then(elearning => {
      if (elearning.message) {
        this.setState({ error: elearning.message });
        return;
      }
      this.setElearnings(); // the delete service only returns deleted one. Reload all from user
      this.setState({ error: null });
      this.setState({ moduleToDelete: null });
    });
  };

  publishModule = (id, status) => {
    this.elearningService
      .publishElearning(id, status)
      .then(result => {
        // Copy array. Replace old item with new item (returned by service)
        const elearningsNew = [...this.state.elearnings];
        const index = elearningsNew.findIndex(elearning => {
          return elearning._id === id;
        });
        elearningsNew.splice(index, 1, result);
        this.setState({
          elearnings: elearningsNew
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: "something went wrong" });
      });
  };

  limitTitle = title => {
    // title longer than 55? Add "..." else return title
    return title.length > 55 ? title.substring(0, title.lastIndexOf(" ")) + " ..." : title;
  }

  render() {
    return (
      <section>
        <h2>E-learning modules created by you</h2>
        <p>
          Published modules are visible for other users and can be made. Private modules are only visible by
          you
        </p>
        {this.state.error && (
          <div>
            <ErrorMessage error={this.state.error} />
          </div>
        )}

        {/* Not logged in */}
        {!this.state.currentUser && <LoginOrSignup setCurrentUser={this.props.setCurrentUser} />}

        {/* Confirm deleting the module */}
        {this.state.moduleToDelete && (
          <DeleteConfirmation
            deleteYes={this.deleteModuleYes}
            deleteNo={this.deleteModuleNo}
            elearning={this.state.moduleToDelete}
          />
        )}

        {/* Displaying all created modules */}
        {this.state.elearnings &&
          this.state.elearnings.map(elearning => {
            return (
              <div key={elearning._id}>
                <h3>{this.limitTitle(elearning.title)}</h3>

                <Link to={`/create/${elearning._id}`}>
                  <button className="buttonOne">edit</button>
                </Link>

                <button className="buttonOne buttonRed" onClick={() => this.deleteModuleCheck(elearning)}>
                  delete
                </button>

                {/* needs refactoring, same as in editelearning */}

                {elearning.status === "private" ? (
                  <button
                    className="buttonOne buttonGreen"
                    onClick={() => this.publishModule(elearning._id, elearning.status)}
                  >
                    publish module to public
                  </button>
                ) : (
                  <button
                    className="buttonOne buttonRed"
                    onClick={() => this.publishModule(elearning._id, elearning.status)}
                  >
                    set module on private
                  </button>
                )}
              </div>
            );
          })}

        {/* spacer for button on next line when no elearnings */}
        {!this.state.elearning && <br />}

        {this.state.currentUser && (
          <button className="buttonOne" onClick={this.showCreateNew}>
            create new e-learning module
          </button>
        )}

        {this.state.newElearning && <CreateElearning />}
      </section>
    );
  }
}

export default CreateOverview;
