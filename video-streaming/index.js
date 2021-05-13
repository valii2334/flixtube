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
const VIDEO_STORAGE_PORT = parseInt(process.env.VIDEO_STORAGE_PORT);
console.log(
  `Forwarding video requests to ${VIDEO_STORAGE_HOST}:${VIDEO_STORAGE_PORT}.`
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// This will not work in Safari. Here is the explanation why
// http://www.the-data-wrangler.com/video-streaming-in-safari
app.get("/video", (req, res) => {
  const forwardRequest = http.request(
    // Forward the request to the video storage microservice.
    {
      host: VIDEO_STORAGE_HOST,
      port: VIDEO_STORAGE_PORT,
      path: "/video?path=sample_video.mp4", // Video path is hard-coded for the moment.
      method: "GET",
      headers: req.headers
    },
    forwardResponse => {
      res.writeHeader(forwardResponse.statusCode, forwardResponse.headers);
      forwardResponse.pipe(res);
    }
  );

  req.pipe(forwardRequest);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
