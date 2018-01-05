const { assert } = require('chai');
const youtube_video_list = require('../index');

const videoFields = [
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
    youtube_video_list('esaevian')
      .then(vids => {
        assert.isArray(vids, 'Video list is an array');
        assert.isAbove(vids.length, 0, 'Video list has more than 0 elements');
        assert.hasAllKeys(vids[0], videoFields, 'First video has `title` and `publishedAt` properties');
        done();
      })
      .catch(err => {
        done(err);
      })
  });

  // error tests
  it('should complain that no channel was sent', done => {
    youtube_video_list()
      .then(vids => {
        done(new Error('Should not have returned vids'));
      })
      .catch(err => {
        assert.isOk(err);
        done();
      });
  });

  it('should complain that no channel exists', done => {
    const testChannel = Math.random().toString(36);
    youtube_video_list(testChannel)
      .then(vids => {
        console.log(JSON.stringify(vids));
        done(new Error(`should have returned an error, unless ${testChannel} exists?`))
      })
      .catch(err => {
        assert.isOk(err);
        done();
      })
  })
})