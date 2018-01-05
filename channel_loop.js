const youtube = require('./promisify_google');
const channelSearch = require('./channel_search');

module.exports = channelName => {
  return channelInfo = channelSearch(channelName)
    .then(channelInfo => {
      const playlistId = channelInfo.contentDetails.relatedPlaylists.uploads;
      return playlistId
    })
    .then(playlistId => {
      return getUploads(playlistId);
    });
}

const getUploads = (playlistId, nextPageToken = '', videos = []) => {
  const opts = {
    part:'id, snippet',
    playlistId,
    maxResults:50,
    pageToken:nextPageToken
  };

  return youtube.playlistItemsList(opts)
    .then(playlistItems => {
      const currentVids = playlistItems.items.map(item => {
        const snippet = item.snippet; 
        return {
          title: snippet.title,
          description: snippet.description,
          thumbs: snippet.thumbnails,
          channelTitle: snippet.channelTitle,
          videoId: snippet.resourceId.videoId,
          publishedAt: new Date(snippet.publishedAt)
        }
      }); 

      videos = [...videos, ...currentVids];

      if (!playlistItems.nextPageToken || videos.length >= 100) {
        return videos;
      } else {
        return getUploads(playlistId, playlistItems.nextPageToken, videos);
      }
    });
}