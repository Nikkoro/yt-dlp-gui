import express from "express";
import cors from "cors";
import { exec } from "child_process";
import { body, validationResult } from "express-validator";

const PORT = 3000;
const downloadSong = (yturl) => {
  exec(
    `yt-dlp -f bestaudio --extract-audio --audio-format mp3 --embed-thumbnail --add-metadata -o "%(title)s.%(ext)s" ${yturl}`,
    { cwd: "../binaries" }
  );
};

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello WorldxD!");
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
