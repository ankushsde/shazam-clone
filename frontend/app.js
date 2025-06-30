let meydaAnalyzer;
let listeningDots = 0;
let listeningInterval;
let canvasCtx = document.getElementById("spectrum").getContext("2d");

async function startListening() {
  document.getElementById("result").innerText = "🎤 Listening";
  document.getElementById("result").className = "listening";
  startListeningAnimation();

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaStreamSource(stream);

  let hashes = [];

  meydaAnalyzer = Meyda.createMeydaAnalyzer({
    audioContext: audioContext,
    source: source,
    bufferSize: 512,
    featureExtractors: ["amplitudeSpectrum"],
    callback: features => {
      drawSpectrum(features.amplitudeSpectrum);

      let amps = features.amplitudeSpectrum;
      let maxVal = 0, maxFreq = 0;
      for (let f = 0; f < amps.length; f++) {
        if (amps[f] > maxVal) {
          maxVal = amps[f];
          maxFreq = f;
        }
      }

      if (maxVal > 0.01) {
        let time = Math.floor(Date.now() / 100) % 10;
        hashes.push(`${maxFreq}-${maxFreq+2}-${time}`);
      }
    }
  });

  meydaAnalyzer.start();

  setTimeout(() => {
    meydaAnalyzer.stop();
    stopListeningAnimation();
    sendToServer(hashes);
  }, 5000);
}

function drawSpectrum(spectrum) {
  let width = 600, height = 200;
  canvasCtx.clearRect(0, 0, width, height);

  for (let i = 0; i < spectrum.length; i++) {
    let barHeight = spectrum[i] * height * 2;
    canvasCtx.fillStyle = `hsl(${i / spectrum.length * 360}, 100%, 50%)`;
    canvasCtx.fillRect(i * (width / spectrum.length), height - barHeight, (width / spectrum.length), barHeight);
  }
}

function startListeningAnimation() {
  listeningDots = 0;
  listeningInterval = setInterval(() => {
    listeningDots = (listeningDots + 1) % 4;
    document.getElementById("result").innerText = 
      "🎤 Listening" + ".".repeat(listeningDots);
  }, 500);
}

function stopListeningAnimation() {
  clearInterval(listeningInterval);
}

async function sendToServer(hashes) {
  document.getElementById("result").innerText = "🔍 Matching...";
  const res = await fetch("http://localhost:3001/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hashes })
  });
  const data = await res.json();

  if (data.song) {
    document.getElementById("result").innerText = `🎶 Detected: ${data.song} (${data.count} hits)`;
    document.getElementById("result").className = "matched";
  } else {
    document.getElementById("result").innerText = "😢 No match found.";
    document.getElementById("result").className = "notfound";
  }
}
