const youtube = require('./promisify_google');

module.exports = (channelName = 'downrightdpad') => {
  const opts = {
    forUsername:channelName,
    part:'id, contentDetails'
  };
  
  return youtube.channelList(opts)
    .then(channelsData => {
      if (!channelsData.items || channelsData.items.length === 0) {
        return Promise.reject(new Error('No Channels Found'));
      }
      const channel = channelsData.items[0];
      return channel;
    });
}