import React from "react";

const VideoBackground = ({ videoSrc }) => {
  return (
    <div className="video-background">
      <video autoPlay loop muted playsInline>
        <source src={videoSrc} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoBackground;