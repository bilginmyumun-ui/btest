// 1-Click Bettermode Debugger UI
// A minimal full-stack debug dashboard for Bettermode interactions
// Shows:
// - incoming requests
// - last response
// - render state
// - live logs

import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let lastRequest = null;
let lastResponse = null;
let logs = [];

function log(msg) {
  const entry = `[${new Date().toISOString()}] ${msg}`;
  logs.push(entry);
  if (logs.length > 50) logs.shift();
  console.log(entry);
}

// -------------------------
// DEBUG DASHBOARD UI
// -------------------------
app.get("/debug", (req, res) => {
  res.send(`
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Bettermode Debugger</title>
  <style>
    body { font-family: Arial; margin:0; background:#0f172a; color:white; }
    .wrap { display:grid; grid-template-columns: 1fr 1fr; height:100vh; }
    .panel { padding:20px; overflow:auto; border-right:1px solid #1e293b; }
    pre { background:#111827; padding:10px; border-radius:8px; overflow:auto; }
    h2 { color:#38bdf8; }
    .ok { color:#22c55e; }
    .warn { color:#f59e0b; }
  </style>
</head>
<body>
<div class="wrap">

  <div class="panel">
    <h2>📥 Last Request</h2>
    <pre id="req">${JSON.stringify(lastRequest, null, 2)}</pre>

    <h2>📤 Last Response</h2>
    <pre id="res">${JSON.stringify(lastResponse, null, 2)}</pre>
  </div>

  <div class="panel">
    <h2>📜 Logs</h2>
    <pre>${logs.join("\n")}</pre>
  </div>

</div>

<script>
setInterval(async () => {
  const res = await fetch('/debug-state');
  const data = await res.json();

  document.getElementById('req').innerText = JSON.stringify(data.lastRequest, null, 2);
  document.getElementById('res').innerText = JSON.stringify(data.lastResponse, null, 2);
}, 2000);
</script>
</body>
</html>
  `);
});

// -------------------------
// DEBUG STATE API
// -------------------------
app.get("/debug-state", (req, res) => {
  res.json({
    lastRequest,
    lastResponse,
    logs
  });
});

// -------------------------
// BETTERMODE INTERACTION ENDPOINT
// -------------------------
app.post("/interaction", (req, res) => {
  lastRequest = req.body;

  log("Incoming interaction");

  const response = {
    type: "INTERACTION",
    status: "SUCCEEDED",
    data: {
      appId: req.body?.data?.appId,
      interactionId: req.body?.data?.interactionId,
      interactions: [
        {
          type: "TOAST",
          props: {
            message: "Debugger active 🚀",
            status: "success"
          }
        }
      ]
    }
  };

  lastResponse = response;
  log("Response sent");

  return res.json(response);
});

// -------------------------
// HEALTH CHECK
// -------------------------
app.get("/", (req, res) => {
  res.send("Bettermode Debugger Running");
});

app.listen(PORT, () => {
  console.log("Debugger running on", PORT);
  console.log("Open /debug for UI");
});
