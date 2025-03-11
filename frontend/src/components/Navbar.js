import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import "../styles/Navbar.css";

function Navbar() {
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar.classList.add('transparent'); // Aggiunge la classe quando si scorre verso il basso
      } else {
        navbar.classList.remove('transparent'); // Rimuove la classe quando si torna in cima
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className="navbar">
      {/* Logo a sinistra */}
      {/* <div className="logoNav">
        <p>GROOVING</p>
      </div> */}

      {/* Menu principale */}
      <ul className="nav-links">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/events" className={({ isActive }) => (isActive ? "active" : "")}>
            Events
          </NavLink>
        </li>
        <li>
          <NavLink to="/past-events" className={({ isActive }) => (isActive ? "active" : "")}>
            Past Events
          </NavLink>
        </li>
        <li>
          <NavLink to="/merch" className={({ isActive }) => (isActive ? "active" : "")}>
            Merch
          </NavLink>
        </li>
      </ul>

      {/* Icone Social a sinistra */}
      <div className="navbar-icons">
        <a href="https://www.instagram.com/__grooving__/" className="icon" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a href="mailto:info@grooving.com" className="icon">
          <FontAwesomeIcon icon={faEnvelope} />
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
