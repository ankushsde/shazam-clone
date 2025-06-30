# 🎧 Shahzam — Tiny Shazam clone in JavaScript

🚀 A playful experiment to understand how Shazam-like music recognition works by building it yourself.  
🎯 No machine learning, just clever DSP (Digital Signal Processing) & inverted index search.

---

## 🏗 Tech Highlights
✅ Fully built in JavaScript (Node.js + Express + Meyda + plain HTML/JS frontend)  
✅ Single monorepo, no microservices — just `/backend` & `/frontend` folders  
✅ Uses JSON (`db.json`) as a tiny DB — **no external DB setup needed**  
✅ Runs locally on your laptop, listens to your microphone live.

---

## ⚙️ How it works
1. 🎤 Click **Start Listening** in your browser.  
2. 🔥 Meyda (running in browser) captures tiny audio slices (512 samples) from your mic, does FFT to get frequency spectrum.  
3. 📈 Finds the loudest frequency in each slice, builds **peaks over time**.  
4. 🧬 Forms pairs of peaks → creates **unique hashes**.  
5. 🚀 Sends these hashes to your backend via POST `/match`.  
6. 🗄 Backend looks up hashes in `db.json` (pre-generated fingerprints of songs).  
7. 🎵 Returns the best match (or "No match found").  
8. 🥳 Displays song name in your browser.

---

## 🐣 v1 Scope
✅ Live microphone listening  
✅ Generates hashes in browser using Meyda  
✅ Looks up hashes in local JSON DB  
✅ Detects simple 3 songs  
✅ No ML, no GPU needed

## 🚀 v2 (future ideas)
🚀 Better peak pairing & time offset clustering (closer to Shazam paper)  
🎵 Store more songs (optimize with hashed database / trie)  
📊 Visualize confidence level (bar graph, not just yes/no)  
🌎 Deploy on server with upload endpoint for short clips  
🎧 Add fallback: let user upload audio file if mic fails

---

## 🚀 Running locally

### ⬇️ Install dependencies
From your project root:
```bash
cd backend
npm install

Start backend
node index.js
(Backend will run on localhost:3001)

Start frontend
cd frontend
python3 -m http.server 8080
(or use npx serve / live-server / http-server.)
http://localhost:8080


DB:::
{
  "45-47-23": ["Mad About You"],
  "12-14-4": ["Mad About You"],
  "31-33-5": ["Lean On"],
  "56-58-15": ["Lean On"],
  "8-10-12": ["I Took A Pill In Ibiza"]
}


❤️ Why this is cool
✅ Learn how real-world systems like Shazam work under the hood
✅ No need for deep learning — see how clever math & inverted indexes can solve it
✅ Build your own music recognition pipeline — DSP, fingerprints, DB lookup


