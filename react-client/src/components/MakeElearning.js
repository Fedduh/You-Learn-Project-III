     // clear timeout
      // var timeOutID;
      if (this.timeOutID) {
        console.log('clearing')
        clearTimeout(this.timeOutID);
      }
      const currentTime = this.player.getCurrentTime();
      const nextStop = this.state.nextQuestion.timeStart; // make a check for last question
      // compare time to next question time
      if (currentTime < nextStop) {
        const playbackRate = this.player.getPlaybackRate();
        const remainingSeconds = (nextStop - currentTime) / playbackRate;
        const stopPlayingAt = () => {
           this.timeOutID = window.setTimeout(() => this.pauseVideoForQuestion, remainingSeconds * 1000);
           console.log('remaining time is', remainingSeconds)
        }
        stopPlayingAt();
        // const stopPlayingAt = window.setTimeout(this.pauseVideoForQuestion, remainingSeconds * 1000);
      }
    }