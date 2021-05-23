#!/bin/sh

## CONFIG
init_delay=10          # The starting retry delay (in seconds.)
max_delay=$((60*10))   # The maximum amount of time to delay beteween checking for a live stream.
delay="${init_delay}"  # Ongoing delay counter. Doubles itself if there is no live stream.

## VARIABLES
url="${1}"

## FUNCTIONS
ekko () {
  echo "[$(date)] - ${1}"
}

init () {

  if [ -z ${url} ]; then
    ekko "First param must be a URL, but the first param was empty."
    exit 6
  fi

  ekko "Attempting to download stream at URL ${url}... Press Ctrl+C to quit."
}


main () {
  while :; do

    # Attempt to download the stream.
    # We use the name parameter sent to this script to look up the stream url in `ref.json`.
    youtube-dl -f best "${url}"

    # Reset the delay time if youtube-dl exited with 0 error code
    # This would suggest that the streamer ended their stream.
    # In the case that the stream ending was temporary (so the streamer could fix a technical problem),
    # we want youtube-dl to resume quickly afterwards to catch the stream as it continues.
    if [ $? -eq 0 ]; then
      delay=$init_delay;
    fi

    # Slowly increase the delay time between retries.
    # This is done to be polite to the streaming platform.
    # We wait longer and longer between tries, eventually maxing out at ${max_delay} seconds
    if [ $(($delay*2)) -ge $max_delay ];
      then delay=$max_delay
      else delay=$(($delay*2));
    fi

    ekko "Retrying in ${delay} seconds..."
    sleep "${delay}"

  done
}


init
main
