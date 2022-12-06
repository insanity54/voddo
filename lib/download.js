
const debug = require('debug')('voddo')
const YoutubeDlWrap = require('youtube-dl-wrap')

const download = (url, format, cwd) => {
  const ytdl = new YoutubeDlWrap();
  debug(`downloading ${url} (${format}) to ${cwd}`);
  let ytdlee = ytdl
    .exec([
      url, 
      '-f', format
    ], { cwd })
  return ytdlee
}


module.exports = download