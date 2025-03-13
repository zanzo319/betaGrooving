import React from "react";
import "../styles/Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

function Footer() {
  return (
    <div className="footer-container">
      <footer className="footer">
        <div className="footer-left">
          <div className="footer-logoGrooving">
            <p>GROOVING</p>
          </div>
            {/* <a href="mailto:groovingita@gmail.com" className="footer-email">groovingita@gmail.com</a> */}
            {/* <div className="footer-capComune">
              <p>Italy</p>
            </div> */} 
            <div className="footer-copyrights">
              <p>&copy; {new Date().getFullYear()} GROOVING. All Rights Reserved.</p>
            </div>
        </div>
        <div className="footer-right">
          <div className="footer-followUs">
            <p>Follow Us</p>
          </div>
          <div className="footer-socialIcons">
            <a href="https://www.instagram.com/__grooving__" className="icon" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="mailto:groovingita@gmail.com" className="icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;