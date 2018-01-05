# Youtube Video List

## Installation

Clone the repo. May also be on npm (I'm thinkin about it):

```
npm install --save youtube_video_list
```

## Use

`youtube_video_list(channelName:String, API_KEY:String):Promise`

```javascript
const youtube_video_list = require('youtube_video_list');
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // grab your api key from http://developers.google.com
const channelName = 'esaevian'; // The channel we are looking for. This is the username, may not match the channel URL!

let videos = [];

youtube_video_list(channelName, YOUTUBE_API_KEY)
  .then(vids => videos = vids);
  .catch(err => console.log('Something went wrong!'));
```

## Upcoming features

- Set length of output (currently limited to 100)
- "fuzzy" searching of usernames?
- Only return videos published after a certain date