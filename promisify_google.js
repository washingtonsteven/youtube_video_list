const google = require('googleapis');
require('dotenv').config();
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

const promisify_google = fn => {
  return opts => {
    return new Promise((resolve, reject) => {
      fn(opts, (err, data) => {
        if (err || !data) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}

exports.promisify = promisify_google;
exports.channelList = promisify_google(youtube.channels.list);
exports.playlistItemsList = promisify_google(youtube.playlistItems.list);