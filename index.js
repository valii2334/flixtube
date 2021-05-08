const express = require("express");
const fs = require("fs");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/video", (req, res) => {
  const path = "./sample_video.mp4";

  fs.stat(path, (err, stats) => {
    if (err) {
      console.error(err);
      console.error("An error occurred");
      res.sendStatus(500);
      return;
    }

    res.writeHead(200, {
      "Content-Length": stats.size,
      "Content-Type": "video/mp4"
    });

    fs.createReadStream(path).pipe(res);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
