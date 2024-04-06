document.addEventListener("DOMContentLoaded", () => {
  const sounds = {
    boom: new Audio("sounds/boom.wav"),
    clap: new Audio("sounds/clap.wav"),
    hihat: new Audio("sounds/hihat.wav"),
    kick: new Audio("sounds/kick.wav"),
    openhat: new Audio("sounds/openhat.wav"),
    ride: new Audio("sounds/ride.wav"),
    snare: new Audio("sounds/snare.wav"),
    tink: new Audio("sounds/tink.wav"),
    tom: new Audio("sounds/tom.wav"),
  };

  const keyMap = {
    KeyQ: "boom",
    KeyW: "clap",
    KeyE: "hihat",
    KeyR: "kick",
    KeyA: "openhat",
    KeyS: "ride",
    KeyD: "snare",
    KeyF: "tink",
    KeyG: "tom",
  };

  const recordingState = {
    isRecording: [false, false, false, false],
    recordings: [[], [], [], []],
    recordingStartTime: [null, null, null, null],
    channelLockState: [false, false, false, false],
  };

  function playSound(sound, channel = null) {
    if (sounds[sound]) {
      sounds[sound].currentTime = 0;
      sounds[sound].play();

      if (channel !== null && recordingState.isRecording[channel]) {
        const time = Date.now() - recordingState.recordingStartTime[channel];
        recordingState.recordings[channel].push({ time: time, sound: sound });
        console.log(`Recorded ${sound} on channel ${channel} at ${time}ms`);
      }
    }
  }

  function animatePad(sound) {
    const pad = document.querySelector(`.drum-pad[data-sound="${sound}"]`);
    pad.classList.add("active");
    setTimeout(() => pad.classList.remove("active"), 100);
  }

  document.querySelectorAll(".drum-pad").forEach((pad) => {
    pad.addEventListener("click", (event) => {
      const sound = event.currentTarget.dataset.sound;
      animatePad(sound);
      playSound(sound);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (keyMap[e.code]) {
      const sound = keyMap[e.code];
      animatePad(sound);
      recordingState.isRecording.forEach((isRec, channel) => {
        if (isRec) {
          playSound(sound, channel);
        } else {
          playSound(sound);
        }
      });
    }
  });

  document.querySelectorAll(".channel").forEach((channel) => {
    const channelNumber = parseInt(channel.dataset.channel, 10);
    const toggleButton = channel.querySelector(".toggle-recording");
    const playButton = channel.querySelector(".play-recording");
    const lockButton = channel.querySelector(".lock-channel");

    toggleButton.addEventListener("click", () => {
      if (!recordingState.isRecording[channelNumber]) {
        recordingState.isRecording[channelNumber] = true;
        recordingState.recordings[channelNumber] = [];
        recordingState.recordingStartTime[channelNumber] = Date.now();
        toggleButton.textContent = "Zakończ Nagrywanie";
        toggleButton.classList.add("is-recording");
        console.log(`Started recording on channel ${channelNumber}`);
      } else {
        recordingState.isRecording[channelNumber] = false;
        toggleButton.textContent = "Rozpocznij Nagrywanie";
        toggleButton.classList.remove("is-recording");
        console.log(
          `Stopped recording on channel ${channelNumber}. Recorded notes:`,
          recordingState.recordings[channelNumber]
        );
      }
    });

    lockButton.addEventListener("click", () => {
      recordingState.channelLockState[channelNumber] =
        !recordingState.channelLockState[channelNumber];
      if (recordingState.channelLockState[channelNumber]) {
        lockButton.textContent = "Odblokuj Odtwarzanie";
        playButton.classList.add("locked");
        playButton.disabled = true;
      } else {
        lockButton.textContent = "Zablokuj Odtwarzanie";
        playButton.classList.remove("locked");
        playButton.disabled = false;
      }
    });

    playButton.addEventListener("click", () => {
      if (recordingState.channelLockState[channelNumber]) {
        console.log(`Playback is locked on channel ${channelNumber}.`);
        return;
      }
      console.log(`Playing back recording from channel ${channelNumber}`);
      recordingState.recordings[channelNumber].forEach((note) => {
        setTimeout(() => {
          playSound(note.sound);
          animatePad(note.sound);
        }, note.time);
      });
    });
  });
});

let metronomeInterval;
let metronomeActive = false;
const metronomeSound = new Audio("sounds/tink.wav");
const metronomeToggleButton = document.getElementById("metronome-toggle");

metronomeToggleButton.addEventListener("click", () => {
  metronomeActive = !metronomeActive;
  if (metronomeActive) {
    startMetronome();
    metronomeToggleButton.textContent = "Wyłącz";
  } else {
    stopMetronome();
    metronomeToggleButton.textContent = "Włącz";
  }
});

document.getElementById("metronome-bpm").addEventListener("input", (e) => {
  if (metronomeActive) {
    stopMetronome();
    startMetronome();
  }
});

function startMetronome() {
  const bpm = document.getElementById("metronome-bpm").value;
  const interval = 60000 / bpm;
  metronomeInterval = setInterval(() => {
    metronomeSound.currentTime = 0;
    metronomeSound.play();
  }, interval);
}

function stopMetronome() {
  clearInterval(metronomeInterval);
}
