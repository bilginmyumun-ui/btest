import express from "express";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// --------------------
// HEALTH CHECK
// --------------------
app.get("/", (req, res) => {
  res.send("Server is running");
});

// --------------------
// BETTERMODE INTERACTION
// --------------------
app.post("/", (req, res) => {
  const body = req.body || {};

  console.log("Incoming:", JSON.stringify(body, null, 2));

  const appId = body?.data?.appId;
  const interactionId = body?.data?.interactionId;

  const iframeUrl =
    "https://bettermode.com/hub/community/ask-for-help";

  const responsePayload = {
    type: "INTERACTION",
    status: "SUCCEEDED",
    data: {
      appId,
      interactionId,
      interactions: [
        {
          type: "SHOW",
          id: interactionId,
          slate: {
            rootBlock: "root",
            blocks: [
              {
                id: "root",
                name: "Container",
                props: JSON.stringify({
                  direction: "vertical",
                  padding: "sm"
                }),
                children: JSON.stringify(["iframe-child"])
              },
              {
                id: "iframe-child",
                name: "Iframe",
                props: JSON.stringify({
                  src: iframeUrl,
                  height: 720,
                  title: "Bettermode"
                }),
                children: JSON.stringify([])
              }
            ]
          }
        }
      ]
    }
  };

  return res.json(responsePayload);
});

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
