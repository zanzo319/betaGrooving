import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import "../styles/Navbar.css";

function Navbar() {
  const location = useLocation(); // Usato per rilevare la pagina attuale

  const isHomePage = location.pathname === "/";

  return (
    <nav className="navbar">
      {/* Logo solo sulle pagine diverse da Home */}
      {!isHomePage && (
        <div className="logoNav">
          <NavLink to="/" className="logo-link">
            <p>GROOVING</p>
          </NavLink>
        </div>
      )}

      {/* Menu principale */}
      <ul className="nav-links">
        <li>
          <NavLink
            to="/events"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Events
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/past-events"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Past Events
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/merch"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Merch
          </NavLink>
        </li>
      </ul>

      {/* Icone Social */}
      <div className={`navbar-icons ${isHomePage ? "left-icons" : ""}`}>
        <a
          href="https://www.instagram.com/__grooving__/"
          className="icon"
          target="_blank"
          rel="noopener noreferrer"
        >
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