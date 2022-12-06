const YoutubeDlWrap = require('youtube-dl-wrap');
const youtubedl = new YoutubeDlWrap();
const helloThereVideo = 'https://www.youtube.com/watch?v=rpXMSIYDx3I';
const cbMel = 'https://chaturbate.com/projektmelody/';
const testStream = 'https://chaturbate.com/milanaaafit/';
const EventEmitter = require('node:events');
const spawn = require("child_process").spawn;
const Readable = require("stream").Readable;
const os = require('os');
const fs = require('fs');
const path = require('path');
const debug = require('debug')('voddo');
const { Observable, defer, timer, interval, of, config } = require('rxjs')
const { repeat, retry, delay, retryWhen, pipe, catchError, throwError, mergeMap, tap } = require('rxjs/operators');
const download = require('./download');
const amqp = require('./amqp');


const offlineRegex = /ERROR:.*offline/;
const destinationRegex = /Destination:\s+(.+\.\S+)/;
const fakePath = '/tmp/projektmalady 2021-01-01 fakevid.mp4';
const isObserving = true;

class VoddoEmitter extends EventEmitter {}


class Voddo {
  constructor (opts) {
    this.ee = new VoddoEmitter();
    this.url = opts.url
    this.format = opts.format || 'best'
    this.cwd = opts.cwd || os.tmpdir()
    this.mqRoutingKey = opts?.mqRoutingKey
    this.mqUrl = opts?.mqUrl
    this.mqExchange = opts?.mqExchange
  }


  initMq () {
    const channel = amqp(this.mqUrl, this.mqExchange, this.mqRoutingKey)
  }

  /**
   * observe the ffmpeg instance
   * act on it's emissions (new video file created on disk)
   * 
   * observable emissions
   *   new video --> next
   *   
   */
  observe () {
    const observer = {
      next: function (value) {
        debug(`  [*>>>>>>>] next! ${value}`)
      },
      complete: function() {
        debug(`  [*>>>>>>>] completed!`)
      }
    }
    const source = Observable.create((obs) => {
      console.log('  [*] the beautiful act of creation!')
      const ee = download(this.url, this.format, this.cwd)
      ee.on('youtubeDlEvent', (eventType, eventData) => {
        debug(`  [*] youtubeDlEvent was JUST emitted. eventType:${eventType}, eventData:${eventData}`)
        if (eventType === 'download' && eventData.includes('Destination:')) {
          obs.next(/Destination:\s(.*)$/.exec(eventData)[1])
        }
      })
      ee.on('error', (err) => {
        debug('  [*] error')
        debug(err)
        obs.error(err)
      })
      ee.on('close', () => {
        debug('  [*] got a close event')
        obs.complete()
      })
    })


    
    config.onUnhandledError = ((err) => {
      console.error('  [***] UNHANDLED ERROR')
      console.error(err)
    })

    // const sampleSource = interval(1000)
    //   .pipe(
    //     mergeMap(val => val > 5 ? throwError(() => 'Error!') : of(val)),
    //   )

    const backoffTimer = (err, count) => {
      if (typeof count === 'undefined') count = err;
      const delayTime = Math.min(600000, 2 ^ count * 10000)
      debug(`  [b] backoffTimer is going to delay for ${delayTime}ms. count:${count}, err:${err}`)
      console.log('backupfoaifjaof timer!!!!')
      return timer(delayTime) // back-off timer maxing out at 10 mins
    }



    // return an Observable which repeats forever regardless of complete or error
    const result = source
      .pipe(
        retry({ 
          delay: ((err, retryCount) => timer(Math.min(600000, 2 ^ retryCount * 1000)))
        }),
        // repeat({
        //   delay: backoffTimer,
        //   resetOnSuccess: true
        // })
      ).subscribe(observer)

      return result
  }


  parseOutput = (output) => {
    let r = destinationRegex.exec(output);
    if (!r) {
      throw new Error('destination filename could not be found in the ffmpegWrapper output');
    }
    return r[1];
  }


  sleepFor = async (ms = 1000) => {
    debug(`  [*] sleeping for ${ms}ms`);
    return new Promise((resolve) => {
      setTimeout(() => {
        debug(`  [*] sleep finished`)
        resolve()
      }, ms);
    })
  }
}




// const observe = (url, defaultDelay, maxDelay) => {
//   defaultDelay = defaultDelay || 1000 * 15; // The starting retry delay
//   maxDelay = maxDelay || 1000 * 60 * 10; // The maximum amount of time to delay beteween checking for a live stream.
//   const ee = new VoddoEmitter();
//   let delay = defaultDelay;
//   let _observeP = (async () => {
//     while (isObserving) {
//       await sleepFor(delay);
//       let res;
//       try {
//         res = await download(url);
//       } catch (e) {
//         if (typeof e.message === 'undefined' || !offlineRegex.test(e.message)) {
//           console.error('throwing due to unhandled error')
//           throw e;
//         }
//       }
//       debug(`response:${res}, delay:${delay}`);
//       if (typeof res === 'string') {
//         const dest = parseOutput(res);
//         ee.emit('complete', dest);
//         delay = defaultDelay;
//       } else {
//         delay = (delay * 2 > maxDelay) ? maxDelay : delay * 2;
//       }
//     }
//   })()
//   return ee;
// }





module.exports = Voddo

