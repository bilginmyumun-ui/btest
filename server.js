import express from "express";

const app = express();

app.use(express.json());

app.post("/interaction", (req, res) => {
  res.json({
    type: "INTERACTION",
    status: "SUCCEEDED",
    data: {
      appId: "D48WpcgssldD",
      interactionId: "qZi2hXy9QQJFFpyAESHJF",
      interactions: [
        {
          type: "SHOW",
          id: "qZi2hXy9QQJFFpyAESHJF",
          slate: {
            rootBlock: "root",
            blocks: [
              {
                id: "root",
                name: "Container",
                props: "{}",
                children: "[\"iframe-child\"]"
              },
              {
                id: "iframe-child",
                name: "Iframe",
                props: JSON.stringify({
                  src: "https://aliyapp.azurewebsites.net/gateway/embed?blockKey=chat&actorId=StWLB81F0U",
                  height: 720
                }),
                children: "[]"
              }
            ]
          }
        }
      ]
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("App running on " + PORT);
});
