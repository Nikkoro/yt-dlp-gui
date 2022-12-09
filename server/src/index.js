import express from "express";
import cors from "cors";
import { body, validationResult } from "express-validator";

const PORT = 3000;
import { spawn } from "child_process";

const downloadSong = (yturl) => {
  const download = spawn(
    "yt-dlp",
    [
      "-f",
      "bestaudio",
      "--extract-audio",
      "--audio-format",
      "mp3",
      "--embed-thumbnail",
      "--add-metadata",
      "-o",
      "%(title)s.%(ext)s",
      yturl,
    ],
    { cwd: "../binaries" }
  );

  download.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  download.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  download.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
};

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello WorldxD!");
});

app.post("/video", (req, res) => {
  const youtubeUrl = req.body.url;
  const info = spawn("yt-dlp", [
    "--get-title",
    "--get-thumbnail",
    "--get-filename",
    youtubeUrl,
  ]);

  info.stdout.on("data", (chunk) => {
    console.log(`yt-dlp stdout: ${chunk}`);
  });

  info.stderr.on("data", (chunk) => {
    console.error(`yt-dlp stderr: ${chunk}`);
  });

  info.on("close", (code) => {
    console.log(`yt-dlp exited with code: ${code}`);
  });

  let data = "";

  info.stdout.on("data", (chunk) => {
    data += chunk;
  });

  info.on("close", () => {
    const lines = data.split("\n");
    const video = {
      title: lines[0],
      thumbnail: lines[1],
      author: lines[2],
    };

    res.json(video);
  });
});

app.post("/download", body("url").isURL(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const yturl = req.body.url;
  downloadSong(yturl);
  return res.status(200).json({ message: "Download started" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
