import React from "react";
import "../styles/About.css"; // Importa il file CSS per gli stili

const About = () => {
  return (
    <div className="about-container">
      <div className="video-section">
        <div className="video-background">
          <video autoPlay loop muted playsInline>
            <source src="/videos/about-video.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="about-content">
          <p className="logo">GROOVING</p>
          <p className="motto">The Underground Sound Machine</p>
        </div>
      </div>
      {/* Seconda sezione distaccata */}
      <div className="extra-section">
       <h1 className="text-blue-500 text-3xl font-bold underline">
  Ciao, Tailwind CSS è attivo!
</h1>

      </div>
    </div>
  );
};

export default About;
