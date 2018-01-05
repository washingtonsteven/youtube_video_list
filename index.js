const channelLoop = require('./channel_loop');
const GooglePromise = require('./googlePromise');

module.exports = (channelName, API_KEY) => {
  if (!API_KEY) {
    return Promise.reject(new Error('You must provide a valid Youtube API key'))
  } else {
    GooglePromise.setAPIKey(API_KEY);
  }

  if (!channelName) {
    return Promise.reject(new Error('You must provide a channel name!'));
  }

  return channelLoop(channelName);
}