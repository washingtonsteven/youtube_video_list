require('dotenv').config();
var google = require('googleapis');
var youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

exports = module.exports = function(req, res) {
  youtube.channels.list({
    forUsername:'downrightdpad',
    part:'id, contentDetails'
  }, function(err, data){
    if (err) {
      console.log(err);
      res.status(400).json({err});
      return;
    }

    yt_request(res, data.items[0].contentDetails.relatedPlaylists.uploads);

    
  })  
}

var nextPage = null;
var currPage = 0;

function yt_request(res, playlistId) {
  var opts = {
    part:'id',
    playlistId:playlistId,
    maxResults:50
  }

  if (nextPage) {
    opts.pageToken = nextPage;
  }

  youtube.playlistItems.list(opts, function(perr, pdata){
    if (perr) {
      res.status(400).json({perr}); return;
    } else {
      if (pdata.nextPageToken) {
        nextPage = pdata.nextPageToken;
        var startI = currPage * 50;
        var endI = (currPage + 1) * 50;
        console.log(`Got page ${currPage}, videos ${startI} - ${endI}`)
        currPage++;
        yt_request(res, playlistId);
        return;
      } else {
        res.status(200).json({done:"done"});
      }
    }
  });
}