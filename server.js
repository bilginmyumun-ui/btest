import express from "express";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.post("/", (req, res) => {
  console.log("REQ:", req.body);

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
            message: "JSON works 🔥",
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
