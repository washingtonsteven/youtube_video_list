const channelLoop = require('./channel-loop');

module.exports = channelName => {
  if (!channelName) {
    throw new Error('You must provide a channel name!');
  }
  channelLoop(channelName)
  .then( vids => console.log(vids.map(v => `${v.title} - ${v.publishedAt}`)) )
  .catch( err => {console.log('== index:Caught error =='); console.error(err) } );
}