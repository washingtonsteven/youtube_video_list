const google = require('googleapis');
require('dotenv').config();

class GooglePromise {
  setAPIKey(API_KEY) {
    if (!API_KEY || typeof API_KEY !== 'string' || API_KEY.trim() === '') {
      throw new Error('Invalid Google API key sent.');
    }

    this.youtube = google.youtube({
      version:'v3',
      auth:API_KEY
    });

    if (this.youtube) {
      this.channelList = this.convertToPromise(this.youtube.channels.list);
      this.playlistItemsList = this.convertToPromise(this.youtube.playlistItems.list);
    } else {
      throw new Error('Creation of new Youtube helper failed');
    }
  }

  convertToPromise(fn) {
    return opts => {
      return new Promise((resolve, reject) => {
        fn(opts, (err, data) => {
          if (err || !data) reject(err);
          else resolve(data);
        })
      });
    }
  }
}

module.exports = new GooglePromise();