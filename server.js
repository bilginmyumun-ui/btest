// Bettermode Embed Simulator (Minimal Working Replica)
// This simulates how Bettermode would:
// 1. Load embed page
// 2. Provide window context
// 3. Call backend interaction endpoint
// 4. Render simple UI blocks (TOAST / TEXT / IFRAME)

import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// -----------------------------
// 1. SIMULATED EMBED PAGE
// -----------------------------
app.get("/embed", (req, res) => {
  const blockKey = req.query.blockKey || "chat";
  const actorId = req.query.actorId || "test-user";

  res.send(`
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Bettermode Embed Simulator</title>
  <style>
    body { font-family: Arial; margin: 0; padding: 20px; background:#f6f7fb; }
    #app { max-width: 600px; margin: auto; }
    .toast { padding:10px; background:#4caf50; color:white; border-radius:8px; margin-bottom:10px; }
    .box { padding:20px; background:white; border-radius:12px; }
    iframe { width:100%; border:0; border-radius:10px; }
  </style>
</head>
<body>
  <div id="app"></div>

  <script>
    // -----------------------------
    // 2. BETTERMODE-LIKE CONTEXT
    // -----------------------------
    window.__BETTERMODE_CONTEXT__ = {
      blockKey: "${blockKey}",
      actorId: "${actorId}"
    };

    async function callBackend() {
      const res = await fetch("/interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: window.__BETTERMODE_CONTEXT__
        })
      });

      return await res.json();
    }

    function render(interaction) {
      const app = document.getElementById("app");
      app.innerHTML = "";

      const i = interaction.data.interactions[0];

      // TOAST
      if (i.type === "TOAST") {
        const div = document.createElement("div");
        div.className = "toast";
        div.innerText = i.props.message;
        app.appendChild(div);
      }

      // TEXT
      if (i.type === "TEXT") {
        const div = document.createElement("div");
        div.className = "box";
        div.innerText = i.props.text;
        app.appendChild(div);
      }

      // IFRAME
      if (i.type === "IFRAME") {
        const iframe = document.createElement("iframe");
        iframe.src = i.props.src;
        iframe.height = i.props.height || 500;
        app.appendChild(iframe);
      }
    }

    callBackend().then(render);
  </script>
</body>
</html>
  `);
});

// -----------------------------
// 3. SIMULATED BETTERMODE INTERACTION ENDPOINT
// -----------------------------
app.post("/interaction", (req, res) => {
  console.log("Incoming interaction:", req.body);

  const { blockKey } = req.body.data;

  // CHANGE THIS TO TEST DIFFERENT BEHAVIOR

  if (blockKey === "chat") {
    return res.json({
      type: "INTERACTION",
      status: "SUCCEEDED",
      data: {
        interactions: [
          {
            type: "TOAST",
            props: {
              message: "✅ Simulator working",
              status: "success"
            }
          }
        ]
      }
    });
  }

  if (blockKey === "iframe") {
    return res.json({
      type: "INTERACTION",
      status: "SUCCEEDED",
      data: {
        interactions: [
          {
            type: "IFRAME",
            props: {
              src: "https://example.com",
              height: 600
            }
          }
        ]
      }
    });
  }

  return res.json({
    type: "INTERACTION",
    status: "SUCCEEDED",
    data: {
      interactions: [
        {
          type: "TEXT",
          props: {
            text: "Default block rendered"
          }
        }
      ]
    }
  });
});

app.listen(PORT, () => {
  console.log("Bettermode Embed Simulator running on", PORT);
  console.log("Open: http://localhost:" + PORT + "/embed?blockKey=chat&actorId=test");
});
