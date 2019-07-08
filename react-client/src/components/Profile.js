import React, { Component } from "react";
import { Link } from "react-router-dom";
import userService from "../services/UserService";

class Profile extends Component {
  state = {
    lastmodule: null
  };

  UserService = new userService();

  componentDidMount = () => {
    this.loadModule();
  };

  loadModule = () => {
    this.UserService.getLatestModule()
      .then(module => {
        this.setState({
          lastmodule: module
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  limitText = (text, lengthOutput) => {
    // title longer than 65? Add "..." else return title
    const shortText = text.substring(0, lengthOutput);
    return text.length > lengthOutput ? text.substring(0, shortText.lastIndexOf(" ")) + " ..." : text;
  };

  render() {
    return (
      <div>
        <h2>your last module</h2>
        <p>
          Welcome {this.props.currentUser}
          {this.state.lastmodule && (
            <span> - the last module you worked on is {this.state.lastmodule.title}</span>
          )}
        </p>
        {/* NEEDS REFACTOR. copy from elearning overview */}
        {this.state.lastmodule && (
          <div>
            {/* <p>your latest e-learning module is: {this.state.lastmodule.title}</p> */}
            <div className="Elearning-overview-container" id="profile-latest">
              <div className="Elearning-overview-module" key={this.state.lastmodule._id}>
                <Link to={`/play/${this.state.lastmodule._id}`}>
                  <h4>{this.limitText(this.state.lastmodule.title, 55)}</h4>

                  <div className="flip-card">
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                        <img src={this.state.lastmodule.youtube_img} alt="elearning thumbnail" />
                      </div>
                      <div className=" flip-card-back">
                        <p className="no-caps">
                          {this.limitText(this.state.lastmodule.youtube_description, 200)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Profile;
