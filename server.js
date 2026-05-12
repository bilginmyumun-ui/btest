import express from "express";

const app = express();
const PORT = process.env.PORT || 10000;

app.set("trust proxy", true);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bettermode Render app is running");
});

app.get("/embed", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Content-Security-Policy", "frame-ancestors *");

  res.send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Iframe Test</title>
        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f5f5ff;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }

          .box {
            padding: 32px;
            border-radius: 16px;
            background: white;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
            text-align: center;
          }

          h1 {
            margin: 0 0 12px;
            font-size: 28px;
          }

          p {
            margin: 0;
            font-size: 16px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Iframe rendered successfully</h1>
          <p>This content is coming from the Render /embed endpoint.</p>
        </div>
      </body>
    </html>
  `);
});

app.post("/", (req, res) => {
  const body = req.body || {};

  console.log("Incoming body:", JSON.stringify(body, null, 2));

  const appId = body?.data?.appId;
  const interactionId = body?.data?.interactionId;

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const iframeUrl = `${baseUrl}/embed`;

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
                  title: "Iframe Test"
                }),
                children: JSON.stringify([])
              }
            ]
          }
        }
      ]
    }
  };

  console.log("Response payload:", JSON.stringify(responsePayload, null, 2));

  return res.status(200).json(responsePayload);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
