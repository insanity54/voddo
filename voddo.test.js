const voddo = require('./voddo');
const EventEmitter = require('events');

const sampleOutput2 = `[Chaturbate] projektmelody: Downloading webpage
[Chaturbate] projektmelody: Downloading m3u8 information
[download] Destination: projektmelody 2021-01-12 23_04-projektmelody.mp4

[ffmpeg] Downloaded 7927507368 bytes

[download] 100% of 7.38GiB in 02:27:46`;

const sampleOutput1 = `[twitch:stream] dj_crispy: Downloading stream GraphQL
[twitch:stream] dj_crispy: Downloading stream access token GraphQL
[twitch:stream] 41306468110: Downloading m3u8 information
[download] Destination: dj_crispy (live) 2021-01-13 20_19-41306468110.mp4
[ffmpeg] Downloaded 7301793 bytes
[download] 100% of 6.96MiB in 01:07`;

mockDl = (url) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      var notRandomNumbers = [1, 1, 1, fakePath];
      var idx = Math.floor(Math.random() * notRandomNumbers.length);
      resolve(notRandomNumbers[idx]);
    }, 1000);
  })
};

describe('voddo', () => {
  describe('watch', () => {
    test('should return an event emitter', () => {
      const w = voddo.watch('https://twitch.tv/projektmelody');
      expect(w).toBeInstanceOf(EventEmitter);
    })
  })
  describe('parseOutput', () => {
    test('should accept the {String} output from ffmpeg (stdout) and return a {String} filename', () => {
      const output1 = voddo.parseOutput(sampleOutput1);
      expect(output1).toBe('dj_crispy (live) 2021-01-13 20_19-41306468110.mp4');
      const output2 = voddo.parseOutput(sampleOutput2);
      expect(output2).toBe('projektmelody 2021-01-12 23_04-projektmelody.mp4');
    });
    test('should throw an error if the received ffmpeg output does not have a destination filename in it', () => {
      expect(() => { voddo.parseOutput('blah') }).toThrow(/filename could not be found/);
    })
  })
})
