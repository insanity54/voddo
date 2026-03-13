# Voddo

A bash script to help you record a live stream. Great for the times when you just can't make it!

## Features

  * Record any stream that is supported by yt-dlp
  * Always retries recording, 24/7/365.
  * Exponential backoff timer for when the stream is offline, with a configurable max timeout (default 10 minutes)
  * Interruptable backoff, where voddo will retry recording immediately if `.reset-retry` file is written to.
  * Written in bash, for maximum portability and ease of installation.

## Dependencies

  * bash
  * ffmpeg
  * yt-dlp

## Setup

Ensure you have the above dependencies installed. The binaries must be available on the $PATH. That's it for setup.

## Usage

```
$ ./voddo.sh 'twitch.tv/ironmouse'
[Fri 06 Nov 2020 08:10:12 PM PST] - Attempting to download stream... Press Ctrl+C to quit.
[twitch:stream] ironmouse: Downloading stream GraphQL
[twitch:stream] ironmouse: Downloading access token JSON
[twitch:stream] 40375923918: Downloading m3u8 information
[download] Destination: 2020-11-06 20_10-40375923918.mp4
(...)
```

You can use voddo on any streaming site [supported by yt-dlp](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md).

