const voddo = require('./voddo');
const { Observable } = require('rxjs');

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
    test('should return an observable', () => {
      const w = voddo.watch('https://twitch.tv/projektmelody');
      expect(w).toBeInstanceOf(Observable);
    })
    test('should idk', async () => {
      // voddo.watch('https://twitch.tv/ironmouse');
      let output = await voddo('https://www.youtube.com/watch?v=sz2mmM-kN1I');
      expect(output).toBe(0)
    })
    test('should get a filepath of the downloaded video stream', () => {
      expected = '------r|';

    })
  })
})
