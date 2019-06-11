import axios from "axios";

class AuthService {
  service = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
  });

  signup = (username, password, email) => {
    return this.service
      .post("/auth/signup", {
        username: username,
        password: password,
        email: email
      })
      .then(response => {
        // console.log("response is" , response);
        return response.data;
      })
      .catch(err => {
        return err.response.data;
      });
  };

  login = (username, password) => {
    return this.service
      .post("/auth/login", {
        username: username,
        password: password
      })
      .then(response => {
        return response.data;
      })
      .catch(err => {
        return err.response.data;
      });
  };

  isLoggedIn = () => {
    return this.service.get("/auth/isloggedin").then(response => {
      console.log('user is logged in');
      return response.data;
    })
    .catch(err => {
      console.log(err.response.data); 
    });
  };

  logout = () => {
    return this.service.get("/auth/logout").then(response => {
      console.log(response.data); 
    })
  }
}

export default AuthService;
