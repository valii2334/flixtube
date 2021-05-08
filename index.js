const express = require("express");
const fs = require("fs");

const app = express();

if (!process.env.PORT) {
  throw new Error(
    "Please specify the port number for the HTTP server with the env variable PORT."
  );
}

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// This will not work in Safari. Here is the explanation why
// http://www.the-data-wrangler.com/video-streaming-in-safari
app.get("/video", (req, res) => {
  const path = "./videos/sample_video.mp4";

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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
