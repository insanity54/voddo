#!/bin/sh

## CONFIG
init_delay=10          # The starting retry delay (in seconds.)
max_delay=$((60 * 10)) # The maximum amount of time to delay beteween checking for a live stream.
delay="${init_delay}"  # Ongoing delay counter. Doubles itself if there is no live stream.
check_interval=1       # How often to check for signals during interruptable_sleep (in seconds)

## VARIABLES
channel_url="${1}"

## FUNCTIONS
ekko() {
  printf "[%s] - %s\n" "$(date)" "$1"
}

init() {

  mkdir -p ./recordings

  trap 'ekko "Interrupted by user. Exiting..."; exit 0' INT

  if [ -z "${channel_url}" ]; then
    ekko "First param must be a URL, but the first param was empty."
    exit 6
  fi

  command -v yt-dlp >/dev/null 2>&1 || {
    ekko "yt-dlp not found."
    exit 1
  }
  command -v ffmpeg >/dev/null 2>&1 || {
    ekko "ffmpeg not found."
    exit 1
  }

  ekko "Attempting to download stream at URL ${channel_url}... Press Ctrl+C to quit."
}

interruptible_sleep() {
  target="$1"
  elapsed=0
  while [ "$elapsed" -lt "$target" ]; do
    sleep "$check_interval"
    elapsed=$((elapsed + check_interval))

    if [ -f "./.reset-retry" ]; then
      ekko "Reset signal detected during delay. Resetting retry delay to ${init_delay}s."
      delay="$init_delay"
      rm -f "./.reset-retry"
      break
    fi
  done
}

main() {

  while :; do

    if ! playlist_url="$(yt-dlp -g "${channel_url}" 2>/dev/null)"; then
      ekko "yt-dlp failed"
      playlist_url=""
    fi

    if [ -n "${playlist_url}" ]; then

      datestamp="$(date -u +"%Y-%m-%dT%H-%M-%SZ")"
      ffmpeg \
        -headers "User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:105.0) Gecko/20100101 Firefox/105.0" \
        -i "${playlist_url}" \
        -c:v copy \
        -c:a copy \
        -movflags faststart \
        -y \
        -f mpegts \
        "./recordings/${datestamp}.ts"

      # Reset the delay time if yt-dlp exited with 0 error code
      # This would suggest that the streamer ended their stream.
      # In the case that the stream ending was temporary (so the streamer could fix a technical problem),
      # we want yt-dlp to resume quickly afterwards to catch the stream as it continues.
      if [ $? -eq 0 ]; then
        delay="$init_delay"
      fi

    fi


    # Slowly increase the delay time between retries.
    # This is done to be polite to the streaming platform.
    # We wait longer and longer between tries, eventually maxing out at ${max_delay} seconds
    if [ $((delay * 2)) -ge "$max_delay" ]; then
      delay="${max_delay}"
    else
      delay=$(($delay * 2))
    fi

    ekko "Retrying in ${delay} seconds..."
    interruptible_sleep "${delay}"

  done
}

init
main
