import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let lastRequest = null;
let lastResponse = null;
let logs = [];
let lastSlate = null;

function log(msg) {
  const entry = `[${new Date().toISOString()}] ${msg}`;
  logs.push(entry);
  if (logs.length > 50) logs.shift();
  console.log(entry);
}

// -------------------------
// SLATE VALIDATOR (simple but useful)
// -------------------------
function validateSlate(slate) {
  const errors = [];

  if (!slate) return ["Missing slate"];

  if (!slate.rootBlock) {
    errors.push("Missing rootBlock");
  }

  if (!Array.isArray(slate.blocks)) {
    errors.push("blocks must be array");
    return errors;
  }

  const ids = new Set();

  for (const b of slate.blocks) {
    if (!b.id) errors.push("Block missing id");
    if (!b.name) errors.push(`Block ${b.id} missing name`);

    if (ids.has(b.id)) {
      errors.push(`Duplicate block id: ${b.id}`);
    }
    ids.add(b.id);

    // IMPORTANT: detect stringify mistake
    if (typeof b.props === "string") {
      errors.push(`Block ${b.id} has stringified props (❌ likely invalid)`);
    }

    if (typeof b.children === "string") {
      errors.push(`Block ${b.id} has stringified children (❌ likely invalid)`);
    }
  }

  return errors;
}

// -------------------------
// DEBUG UI
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
    .err { color:#f87171; }
    .ok { color:#22c55e; }
  </style>
</head>
<body>
<div class="wrap">

  <div class="panel">
    <h2>📥 Last Request</h2>
    <pre id="req">${JSON.stringify(lastRequest, null, 2)}</pre>

    <h2>📤 Last Response</h2>
    <pre id="res">${JSON.stringify(lastResponse, null, 2)}</pre>

    <h2>🧱 Last Slate</h2>
    <pre id="slate">${JSON.stringify(lastSlate, null, 2)}</pre>

    <h2>⚠️ Slate Validation</h2>
    <pre id="val"></pre>
  </div>

  <div class="panel">
    <h2>📜 Logs</h2>
    <pre>${logs.join("\n")}</pre>
  </div>

</div>

<script>
async function refresh() {
  const res = await fetch('/debug-state');
  const data = await res.json();

  document.getElementById('req').innerText = JSON.stringify(data.lastRequest, null, 2);
  document.getElementById('res').innerText = JSON.stringify(data.lastResponse, null, 2);
  document.getElementById('slate').innerText = JSON.stringify(data.lastSlate, null, 2);

  document.getElementById('val').innerText =
    (data.slateErrors || []).length
      ? data.slateErrors.join("\\n")
      : "OK ✅ Slate looks valid";
}

setInterval(refresh, 2000);
refresh();
</script>

</body>
</html>
  `);
});

// -------------------------
// STATE API
// -------------------------
app.get("/debug-state", (req, res) => {
  res.json({
    lastRequest,
    lastResponse,
    lastSlate,
    slateErrors: lastSlate ? validateSlate(lastSlate) : [],
    logs
  });
});

// -------------------------
// BETTERMODE ENDPOINT
// -------------------------
app.post("/interaction", (req, res) => {
  lastRequest = req.body;

  log("Incoming interaction");

  const slate = {
    rootBlock: "root",
    blocks: [
      {
        id: "root",
        name: "Container",
        props: {
          direction: "vertical",
          padding: "sm"
        },
        children: ["iframe-child"]
      },
      {
        id: "iframe-child",
        name: "Iframe",
        props: {
          src: "https://example.com",
          height: 600
        },
        children: []
      }
    ]
  };

  lastSlate = slate;

  const response = {
    type: "INTERACTION",
    status: "SUCCEEDED",
    data: {
      appId: req.body?.data?.appId,
      interactionId: req.body?.data?.interactionId,
      interactions: [
        {
          type: "SHOW",
          id: "debug",
          slate
        }
      ]
    }
  };

  lastResponse = response;

  log("Response sent");

  return res.json(response);
});

// -------------------------
app.get("/", (req, res) => {
  res.send("Bettermode Debugger Running");
});

app.listen(PORT, () => {
  console.log("Debugger running on", PORT);
  console.log("Open /debug");
});
