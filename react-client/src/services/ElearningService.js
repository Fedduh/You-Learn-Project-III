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
        console.log(err);
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
      // youtube_url: state.youtube_url,
      // youtube_img: state.youtube_img,
      // youtube_title: state.youtube_title,
      // youtube_category: state.youtube_category,
      // youtube_description: state.youtube_description,
      // youtube_duration: state.youtube_duration 
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
