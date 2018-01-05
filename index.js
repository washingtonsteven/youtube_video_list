const channelLoop = require('./channel_loop');

module.exports = channelName => {
  if (!channelName) {
    return Promise.reject(new Error('You must provide a channel name!'));
  }
  return channelLoop(channelName)
    .catch( err => {console.log('== youtube_video_list:Caught error =='); console.error(err); throw err; } );
}