const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const matchHashes = require('./match');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/match', (req, res) => {
  const hashes = req.body.hashes;
  console.log("🎯 Received hashes:", hashes.slice(0,5), "... total:", hashes.length);

  const result = matchHashes(hashes);

  if (result) {
    console.log(`🎵 Matching result: ${result.song} (${result.count} hits)`);
    res.json({ song: result.song, count: result.count });
  } else {
    console.log("😢 No strong match found.");
    res.json({ song: null });
  }
});

app.listen(3001, () => {
  console.log('✅ Server running on port 3001');
});
