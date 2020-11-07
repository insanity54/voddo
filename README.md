# Tivomouse

A bash script to help you record a live stream. Great for the times when you just can't make it!

## Dependencies

  * bash
  * jq

## Setup

Add your favorite streams to `voddo.json`.

```json
[{
    "name": "mouse",
    "url": "https://twitch.tv/ironmouse"
  },
  {
    "name": "tvmel",
    "url": "https://twitch.tv/projektmelody"
  },
  {
    "name": "cbmel",
    "url": "https://chaturbate.com/projektmelody"
  }
]
```

The name property is used in the command line incantation to refer to a stream. The url property is passed to youtube-dl.

## Usage

```
$ ./voddo mouse
[Fri 06 Nov 2020 08:10:12 PM PST] - Attempting to download mouse's stream at URL https://twitch.tv/ironmouse... Press Ctrl+C to quit.
[twitch:stream] ironmouse: Downloading stream GraphQL
[twitch:stream] ironmouse: Downloading access token JSON
[twitch:stream] 40375923918: Downloading m3u8 information
[download] Destination: ironmouse (live) 2020-11-06 20_10-40375923918.mp4
(...)
```

```
$ ./voddo cbmel
[Fri 06 Nov 2020 08:15:38 PM PST] - Attempting to download cbmel's stream at URL https://chaturbate.com/projektmelody... Press Ctrl+C to quit.
[Chaturbate] projektmelody: Downloading webpage
ERROR: Room is currently offline
[Fri 06 Nov 2020 08:15:39 PM PST] - Retrying in 20 seconds...
(...)
```
