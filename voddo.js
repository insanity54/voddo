const YoutubeDlWrap = require('youtube-dl-wrap');
const youtubedl = new YoutubeDlWrap();
const helloThereVideo = 'https://www.youtube.com/watch?v=rpXMSIYDx3I';
const cbMel = 'https://chaturbate.com/projektmelody/';
const testStream = 'https://chaturbate.com/milanaaafit/';
const EventEmitter = require('events');
const spawn = require("child_process").spawn;
const Readable = require("stream").Readable;
const os = require('os');
const fs = require('fs');
const path = require('path');
const debug = require('debug')('voddo');


const offlineRegex = /ERROR:.*offline/;
const destinationRegex = /Destination:\s+(.+\.\S+)/;
const fakePath = '/tmp/projektmalady 2021-01-01 fakevid.mp4';
const isWatching = true;

const watch = (url, defaultDelay, maxDelay) => {
  defaultDelay = defaultDelay || 1000 * 15; // The starting retry delay
  maxDelay = maxDelay || 1000 * 60 * 10; // The maximum amount of time to delay beteween checking for a live stream.

  const ee = new EventEmitter();

  const download = (url) => {
    // YoutubeDlWrap is kinda weird in that it returns an error
    // rather than throwing the error or rejecting the promise.
    return youtubedl.execPromise([url, '-f', 'best']);
  };

  const sleepFor = async (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    })
  }

  let delay = defaultDelay;

  let _watchP = (async () => {
    while (isWatching) {
      await sleepFor(delay);
      let res;
      try {
        res = await download(url);

      } catch (e) {
        if (typeof e.message === 'undefined' || !offlineRegex.test(e.message)) {
          console.error('throwing due to unhandled error')
          throw e;
        } else {
          console.log(`room is offline but we will try again in ${delay}ms`);
        }
      }
      debug(`response:${res}, delay:${delay}`);
      if (typeof res === 'string') {
        ee.emit('complete', res);
        delay = defaultDelay;
      } else {
        delay = (delay * 2 > maxDelay) ? maxDelay : delay * 2;
      }
    }
  })()


  return ee;
}





module.exports = {
  watch
}
