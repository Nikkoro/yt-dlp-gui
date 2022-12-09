import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(JSON.stringify({ url }));
    fetchVideo(url);
  };

  const fetchVideo = async (url) => {
    const response = await fetch("http://localhost:3000/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="App">
      <h1>yt-dlp mp3 downloader</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="url-input">Youtube URL: </label>
        <input
          id="url-input"
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
        />
        <button>Download</button>
      </form>
      <VideoInfo url={url} />
    </div>
  );
}

function VideoInfo({ url }) {
  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (url) {
      fetchVideo(url);
    }
  }, [url]);

  const fetchVideo = async (url) => {
    const response = await fetch("http://localhost:3000/video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();
    setVideo(data);
  };

  if (!video) {
    return null;
  }

  return (
    <div className="videoInfoDiv">
      <img src={video.thumbnail} alt={video.title} />
      <h2>{video.title}</h2>
    </div>
  );
}

export default App;
