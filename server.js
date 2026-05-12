import express from "express";

const app = express();
app.use(express.json());

// health check (Render + browser)
app.get("/", (req, res) => {
  res.send("OK");
});

// Bettermode interaction endpoint
app.post("/interaction", (req, res) => {
  res.json({
    type: "INTERACTION",
    status: "SUCCEEDED",
    data: {
      appId: "D48WpcgssldD",
      interactionId: "qZi2hXy9QQJFFpyAESHJF",
      interactions: []
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Running on", PORT);
});
