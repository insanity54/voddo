# Voddo

A program to help you record a live stream. Great for the times when you just can't make it!

## Features

### Simple bash script voddo.sh

Easy to read bash with 1 dependency (youtube-dl)

  * [x] Automatic retries when stream is offline
  * [x] Configurable retry back-off timer
  * [x] Automatic recording resuming when network goes down

### Advanced javascript (CommonJS/Node) voddo-cli

  * [x] All features of voddo.sh
  * [ ] RabbitMQ subject signalling for system integration
  * [ ] HTTP API for idempotent recording start


## Setup

Install youtube-dl and ensure it is in your system PATH


## Usage

### voddo.sh

```
$ ./voddo https://twitch.tv/ironmouse
[Fri 06 Nov 2020 08:10:12 PM PST] - Attempting to download mouse's stream at URL https://twitch.tv/ironmouse... Press Ctrl+C to quit.
[twitch:stream] ironmouse: Downloading stream GraphQL
[twitch:stream] ironmouse: Downloading access token JSON
[twitch:stream] 40375923918: Downloading m3u8 information
[download] Destination: ironmouse (live) 2020-11-06 20_10-40375923918.mp4
(...)
```

```
$ ./voddo https://chaturbate.com/projektmelody
[Fri 06 Nov 2020 08:15:38 PM PST] - Attempting to download cbmel's stream at URL https://chaturbate.com/projektmelody... Press Ctrl+C to quit.
[Chaturbate] projektmelody: Downloading webpage
ERROR: Room is currently offline
[Fri 06 Nov 2020 08:15:39 PM PST] - Retrying in 20 seconds...
(...)
```

### voddo-cli

`./voddo-cli download -u twitch.tv/bebthebarbariengineer -f best -cwd /home/chris/Downloads`


## notes

what it looks like when a stream ends

```
  voddo twitch:stream  nihmune: Downloading stream GraphQL +417ms
  voddo twitch:stream  nihmune: Downloading stream access token GraphQL +308ms
  voddo twitch:stream  41489791179: Downloading m3u8 information +253ms
  voddo download  Destination: /tmp/1668224695934.mp4 +278ms
  voddo ffmpeg  Downloaded 27738066 bytes +1m
  voddo download  100% of 26.45MiB in 01:13 +0ms
  voddo download all done +48ms

```