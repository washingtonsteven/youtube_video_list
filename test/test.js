require('dotenv').config({path:'../'});
const { assert } = require('chai');
const youtube_video_list = require('../index');

const API_KEY = process.env.YOUTUBE_API_KEY;
const videoProperties = [
  'title',
  'publishedAt',
  'channelTitle',
  'description',
  'thumbs',
  'videoId'
];

describe('youtube_video_list', () => {

  // sanity test
  it('should return an array', done => {
    youtube_video_list('esaevian', API_KEY)
      .then(vids => {
        assert.isArray(vids, 'Video list is an array');
        assert.isAbove(vids.length, 0, 'Video list has more than 0 elements');
        assert.hasAllKeys(vids[0], videoProperties, 'First video has all video properties');
        done();
      })
      .catch(err => {
        done(err);
      })
  });

  // error tests
  it('should complain that no API key was sent', done => {
    youtube_video_list('esaevian')
      .then(vids => { done(new Error('Should have complained about the lack of a key')) })
      .catch(err => { assert.isOk(err); done(); });
  });

  it('should complain that no channel was sent', done => {
    youtube_video_list(null, API_KEY)
      .then(vids => { done(new Error('Should not have returned vids')); })
      .catch(err => { assert.isOk(err); done(); });
  });

  it('should complain that no channel exists', done => {
    const testChannel = Math.random().toString(36);
    youtube_video_list(testChannel, API_KEY)
      .then(vids => { done(new Error(`should have returned an error, unless ${testChannel} exists?`)) })
      .catch(err => { assert.isOk(err); done(); });
  });
})