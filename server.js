import express from "express";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("OK - server is alive");
});

app.post("/", (req, res) => {
  console.log("Incoming:", req.body);

  return res.json({
    type: "INTERACTION",
    status: "SUCCEEDED",
    data: {
      appId: req.body?.data?.appId,
      interactionId: req.body?.data?.interactionId,
      interactions: [
        {
          type: "TOAST",
          props: {
            message: "It works 🔥",
            status: "success"
          }
        }
      ]
    }
  });
});

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
