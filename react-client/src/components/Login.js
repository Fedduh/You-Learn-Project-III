import React, { Component } from "react"; 

class Login extends Component {
  state = {
    username: '',
    password: ''
  };

  // componentDidMount() {
  //   Axios.get("http://localhost:5000/auth/isloggedin").then(result => {
  //     if (result.data.username) {
  //       this.setState({
  //         username: result.data.username
  //       });
  //     }
  //   });
  // }

  render() {
    return <div>Login page of {this.state.username}</div>;
  }
}

export default Login;
