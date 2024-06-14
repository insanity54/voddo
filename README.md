# Voddo

A bash script to help you record a live stream. Great for the times when you just can't make it!

## Dependencies

  * bash
  * ffmpeg
  * yt-dlp

## Setup


## Usage

```
$ ./voddo $(yt-dlp -g 'https://twitch.tv/ironmouse')
[Fri 06 Nov 2020 08:10:12 PM PST] - Attempting to download stream... Press Ctrl+C to quit.
[twitch:stream] ironmouse: Downloading stream GraphQL
[twitch:stream] ironmouse: Downloading access token JSON
[twitch:stream] 40375923918: Downloading m3u8 information
[download] Destination: 2020-11-06 20_10-40375923918.mp4
(...)
```

```
$ ./voddo $(yt-dlp -g 'https://chaturbate.com/projektmelody')
[Fri 06 Nov 2020 08:15:38 PM PST] - Attempting to download stream ... Press Ctrl+C to quit.
[Chaturbate] projektmelody: Downloading webpage
ERROR: Room is currently offline
[Fri 06 Nov 2020 08:15:39 PM PST] - Retrying in 20 seconds...
(...)
```
