import axios from "axios";

class AuthService {
  service = axios.create({
    baseURL: "http://localhost:5000",
    withCredentioals: true
  });
  
  signup = (username, password, email) => {
    console.log('authservice', username, password, email)
    return this.service
      .post("/auth/signup", {
        username: username,
        password: password,
        email: email
      })
      .then(response => {
        console.log("response is" , response);
        return response.data;
      })
      .catch(err => { 
        console.log(err.response.data.message);
        return err;
      })
  };
}

export default AuthService;