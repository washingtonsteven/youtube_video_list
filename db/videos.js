var mongoose = require('mongoose');

var channelSchema = new mongoose.Schema({
  channelId:{ type:String, required:true, index:true },
  channelTitle: { type:String, required:true, index:true },
  uploadsPlaylist: { type:String }
});

var thumbnailSchema = new mongoose.Schema({
  size:String,
  url:{ type:String, required:true },
  width:Number,
  height:Number
});

var videoSchema = new mongoose.Schema({
  videoId:{ type:String, required:true, index:true },
  title: { type:String, required:true },
  description:String,
  publishedAt:Date,
  channel:channelSchema,
  thumbnails:[thumbnailSchema],
  created:{ type:Date, default:Date.now() }
});

mongoose.model('Video', videoSchema);