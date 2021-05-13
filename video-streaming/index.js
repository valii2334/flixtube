const express = require("express");
const http = require("http");

const app = express();

if (!process.env.PORT) {
  throw new Error(
    "Please specify the port number for the HTTP server with the env variable PORT."
  );
}

const PORT = process.env.PORT;
const VIDEO_STORAGE_HOST = process.env.VIDEO_STORAGE_HOST;
const VIDEO_STORAGE_PORT = process.env.VIDEO_STORAGE_PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// This will not work in Safari. Here is the explanation why
// http://www.the-data-wrangler.com/video-streaming-in-safari
app.get("/video", (req, res) => {
  const forwardRequest = http.request(
    {
      host: VIDEO_STORAGE_HOST,
      port: VIDEO_STORAGE_PORT,
      path: "/video?path=sample_video.mp4",
      method: "GET",
      headers: req.headers
    },
    forwardResponse => {
      res.writeHead(forwardResponse.statusCode, forwardResponse.headers);
      forwardResponse.pipe(res);
    }
  );

  res.pipe(forwardRequest);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
