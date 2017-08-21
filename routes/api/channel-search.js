require('dotenv').config();
var mongoose = require('mongoose');
var Video = mongoose.model('Video');
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
    if (err || data.items.length <= 0) {
      console.log(err);
      res.status(400).json({err});
      return;
    }

    var channelId = data.items[0].id;

    console.log('finding video: '+channelId);
    Video.find({'channel.channelId':channelId}).exec(function(verr, vdata){
        if (verr) {
          res.status(400).json({verr}); return;
        }

        console.log('finding video complete ');
        console.log(vdata);
        if (!vdata || vdata.length <= 0) {
          yt_request(res, data.items[0].contentDetails.relatedPlaylists.uploads);
        } else {
          res.status(200).json({'alreadyscraped':true, vdata, data});
        }
      });



    // youtube.playlistItems.list({
    //   part:'id, contentDetails, snippet',
    //   playlistId:data.items[0].contentDetails.relatedPlaylists.uploads
    // }, function(perr, pdata){
    //   res.status(200).json({channel:data, videos:pdata})
    // })

    // youtube.search.list({
    //   channelId:data.items[0].id,
    //   part:'snippet',
    //   type:'video' //TODO: Add date param for searching new vids
    // }, function(serr, sdata){
    //   if (serr) {
    //     res.status(400).json({serr});
    //     return;
    //   }
    //   res.status(200).json({channel:data, videos:sdata});
    // });
  })  
}

var nextPage = null;
var currPage = 0;

function yt_request(res, playlistId) {
  var opts = {
    part:'id, snippet',
    playlistId:playlistId,
    maxResults:5
  }

  if (nextPage) {
    opts.pageToken = nextPage;
  }

  youtube.playlistItems.list(opts, function(perr, pdata){
    console.log('yt call complete');
    console.log(pdata.items.length);
    if (perr) {
      res.status(400).json({perr}); return;
    } else {
      if (pdata.nextPageToken) {
        nextPage = pdata.nextPageToken;
        
        var vids = [];

        for(vidIndex in pdata.items) {
          var vid = pdata.items[0];
          var vidDoc = {
            videoId:vid.id,
            title:vid.snippet.title,
            description:vid.snippet.description,
            publishedAt:new Date(vid.snippet.publishedAt),
            channel:{
              channelId:vid.snippet.channelId,
              channelTitle:vid.snippet.channelTitle,
              uploadsPlaylist:playlistId
            },
            thumbnails:[],
            created:Date.now()
          };

          for(thumbKey in vid.snippet.thumbnails) {
            var thumb = vid.snippet.thumbnails[thumbKey];
            var thumbDoc = {
              size:thumbKey,
              url:thumb.url,
              width:thumb.width,
              height:thumb.height
            }

            vidDoc.thumbnails.push(thumbDoc);
          }

          vids.push(vidDoc);
        }

        Video.create(vids, function(err, createdVids){
          res.status(200).json({created:vids, err})
        });

        //currPage++;
        //yt_request(res, playlistId);
        return;
      } else {
        res.status(200).json({done:"done"});
      }
    }
  });
}