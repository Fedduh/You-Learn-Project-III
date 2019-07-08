import axios from "axios";

class UserService {
  service = axios.create({
    // baseURL: "http://localhost:5000",
    withCredentials: true
  });

  addAnswerToUser = (elearningid, answerid, answer, score, answerGiven) => {
    return this.service
      .post(`/user/addanswer/${answerid}`, {
        elearningid: elearningid,
        answerGiven: answerGiven,
        score: score,
        answer: answer
      })
      .then(status => {
        return status.data;
      })
      .catch(err => {
        console.log(err);
        return err.response.data;
      });
  };

  getLatestModule = () => {
    return this.service
      .get(`/user/getlastmodule`)
      .then(result => {
        return result.data;
      })
      .catch(err => {
        console.log(err);
        return err.response.data;
      });
  };
}

export default UserService;
