const fs = require('fs-extra');
const Meyda = require('meyda');
const { decode } = require('audio-decode');
const path = require('path');

const songsDir = path.join(__dirname, 'songs');
const dbFile = path.join(__dirname, 'db.json');
let db = {};

(async () => {
  const files = await fs.readdir(songsDir);
  for (let file of files) {
    if (!file.endsWith('.mp3')) continue;

    const filePath = path.join(songsDir, file);
    const songName = file.replace('.mp3', '');

    console.log(`🎵 Processing: ${songName}`);

    const audioBuffer = await fs.readFile(filePath);
    const audio = await decode(audioBuffer);

    const channelData = audio.getChannelData(0);
    const frameSize = 512;

    for (let i = 0; i < channelData.length - frameSize; i += frameSize) {
      const frame = channelData.slice(i, i + frameSize);
      const spectrum = Meyda.extract('amplitudeSpectrum', frame);
      if (!spectrum) continue;

      let maxVal = 0;
      let maxFreq = 0;
      for (let f = 0; f < spectrum.length; f++) {
        if (spectrum[f] > maxVal) {
          maxVal = spectrum[f];
          maxFreq = f;
        }
      }

      if (maxVal > 0.01) {
        let time = Math.floor(i / frameSize / 10);
        let hash = `${maxFreq}-${maxFreq+2}-${time}`;
        if (!db[hash]) db[hash] = [];
        if (!db[hash].includes(songName)) {
          db[hash].push(songName);
        }
      }
    }

    console.log(`✅ Finished ${songName}. Total unique hashes: ${Object.keys(db).length}`);
  }

  await fs.writeJSON(dbFile, db, { spaces: 2 });
  console.log(`🎉 DB populated with ${Object.keys(db).length} total unique hashes.`);
})();
