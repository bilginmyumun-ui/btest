app.post("/", (req, res) => {
  const body = req.body || {};

  const appId = body?.data?.appId;
  const interactionId = body?.data?.interactionId;

  const iframeUrl = "https://bettermode.com/hub/community/ask-for-help";

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
                  title: "Bettermode Community"
                }),
                children: JSON.stringify([])
              }
            ]
          }
        }
      ]
    }
  };

  return res.status(200).json(responsePayload);
});
