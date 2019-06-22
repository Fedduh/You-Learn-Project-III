import axios from "axios";

class ElearningService {
  service = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
  });

  getAll = page => {
    return this.service
      .get("/elearning")
      .then(elearnings => {
        return elearnings.data;
      })
      .catch(err => {
        console.log(err);
        return err.response.data;
      });
  };

  getCreatedByUser = () => {
    return this.service
      .get("/elearning/create")
      .then(elearnings => {
        return elearnings.data;
      })
      .catch(err => {
        console.log('error is' , err); 
        return err.response.data;
      });
  };

  getYoutubeSnippetByUrl = url => {
    return this.service
      .post("/elearning/getdetailsbyurl", { youtube_url: url })
      .then(result => {
        // console.log(result);
        return result.data;
      })
      .catch(err => {
        console.log(err);
        return err.response.data;
      });
  };

  createNewElearning = (state) => {
    return this.service.post("/elearning", { 
      state
    })
    .then(result => {
      console.log('created e-learning')
      return result.data;
    })
    .catch(err => {
      console.log(err);
      return err.response.data;
    });
  }

  addQuestion = (id, questionObject) => {
      return this.service.post(`elearning/create/${id}/addquestion`, {
        questionObject
      })
      .then(status => {
        return status.data;
      })
      .catch(err => {
        console.log(err);
        return err.response.data;
      });
  }

  editQuestion = (id, questionObject) => {
    return this.service.post(`elearning/create/${id}/editquestion/${questionObject._id}`, {
      questionObject
    })
    .then(status => {
      return status.data;
    })
    .catch(err => {
      console.log(err);
      return err.response.data;
    });
  }

  deleteQuestion = (id, questionObject) => {
    return this.service.post(`elearning/create/${id}/deletequestion/${questionObject._id}`, {
      questionObject
    })
    .then(status => {
      return status.data;
    })
    .catch(err => {
      console.log(err);
      return err.response.data;
    });
  }

  getOneElearningById = id => {
    return this.service.get(`/elearning/create/${id}`)
      .then(elearning => { 
        return elearning.data;
      })
      .catch(err => {
        console.log(err);
        return err.response.data;
      });
  }
}

export default ElearningService;
