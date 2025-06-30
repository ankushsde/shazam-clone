const db = require('./db.json');

module.exports = function matchHashes(hashes) {
  const counts = {};

  hashes.forEach(hash => {
    if (db[hash]) {
      db[hash].forEach(song => {
        counts[song] = (counts[song] || 0) + 1;
      });
    }
  });

  let bestMatch = null;
  let maxCount = 0;

  for (let song in counts) {
    if (counts[song] > maxCount) {
      bestMatch = song;
      maxCount = counts[song];
    }
  }

  console.log("🎯 Counts:", counts);
  console.log(`🎵 Best: ${bestMatch}, hits=${maxCount}, totalHashes=${hashes.length}`);

  // Threshold logic
  const minHits = 8;
  const minRatio = 0.2;

  if (bestMatch && maxCount >= minHits && (maxCount / hashes.length) >= minRatio) {
    return { song: bestMatch, count: maxCount };
  } else {
    return null;
  }
};
