const GooglePromise = require('./googlePromise');

module.exports = channelName => {
  const opts = {
    forUsername:channelName,
    part:'id, contentDetails'
  };

  return GooglePromise.channelList(opts)
    .then(channelsData => {
      if (!channelsData.items || channelsData.items.length === 0) {
        return Promise.reject(new Error('No Channels Found'));
      }
      const channel = channelsData.items[0];
      return channel;
    });
}