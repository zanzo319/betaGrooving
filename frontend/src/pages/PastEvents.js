import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import "../styles/PastEvents.css";

const PastEvents = () => {
  const [eventiPassati, setEventiPassati] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchEventiPassati = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/eventi");

        if (!Array.isArray(response.data)) {
          throw new Error("Dati non validi ricevuti dal server");
        }

        const eventiPassati = response.data
          .filter((evento) => new Date(evento.data).getTime() < new Date().getTime())
          .sort((a, b) => new Date(b.data) - new Date(a.data));

        // Duplica gli eventi per creare un carosello ciclico senza interruzioni
        setEventiPassati([...eventiPassati, ...eventiPassati, ...eventiPassati]);
        setCurrentIndex(eventiPassati.length); // Posiziona inizialmente il carosello al centro
      } catch (err) {
        console.error("Errore nel recupero degli eventi passati:", err);
        setError("Errore nel recupero degli eventi passati.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventiPassati();
  }, []);

  const handleScroll = (direction) => {
    const originalLength = eventiPassati.length / 3; // Lunghezza degli eventi reali

    let newIndex = currentIndex;

    if (direction === "left") {
      newIndex -= 1;
    } else {
      newIndex += 1;
    }

    setCurrentIndex(newIndex);

    // Se raggiungiamo uno dei bordi estremi, riposizioniamo silenziosamente
    setTimeout(() => {
      if (newIndex < originalLength) {
        setCurrentIndex(newIndex + originalLength); // Riposiziona senza interruzioni visive
      } else if (newIndex >= originalLength * 2) {
        setCurrentIndex(newIndex - originalLength); // Riposiziona senza interruzioni visive
      }
    }, 500); // Allinea il riposizionamento al tempo della transizione
  };

  // Calcola lo stile per il carosello
  const carouselStyle = {
    transform: `translateX(calc(-${currentIndex} * (25% + 20px)))`,
    transition: "transform 0.5s ease",
  };

  return (
    <div className="eventi-passati-container">
      {/* Meta tag per la pagina degli eventi passati */}
      <Helmet>
        <title>Past Events - Grooving</title>
        <meta
          name="description"
          content="Take a look at past events organized by Grooving. Relive the best performances, line-ups, and unforgettable music experiences."
        />
        <meta
          name="keywords"
          content="past events, grooving, concerts, underground music, previous line-ups, music experiences"
        />
        <meta name="author" content="Grooving Team" />
        <meta property="og:title" content="Past Events - Grooving" />
        <meta
          property="og:description"
          content="Check out the archive of Grooving's past events and relive the greatest underground music experiences."
        />
        <meta property="og:image" content="/images/og-past-events.png" />
        <meta property="og:url" content="http://yourdomain.com/past-events" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <h1 className="page-title">PAST EVENTS</h1>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p className="loading-message">Loading events...</p>
      ) : (
        <div className="carousel-container" ref={carouselRef}>
          {/* Pulsante Sinistro */}
          <button className="scroll-button" onClick={() => handleScroll("left")}>
            ❮
          </button>

          <div className="carousel" style={carouselStyle}>
            {eventiPassati.map((evento, index) => (
              <div
                key={index}
                className={`carousel-item ${index === currentIndex ? "active" : ""}`}
              >
                <EventCard evento={evento} isActive={index === currentIndex} />
              </div>
            ))}
          </div>

          {/* Pulsante Destro */}
          <button className="scroll-button" onClick={() => handleScroll("right")}>
            ❯
          </button>
        </div>
      )}
    </div>
  );
};

const EventCard = ({ evento, isActive }) => {
  if (!evento) return null; // Gestione di eventi nulli
  return (
    <div className={`evento ${isActive ? "evento-active" : ""}`}>
      <div className="event-content">
        {evento.locandina && (
          <img
            src={(`http://localhost:8080/uploads/${evento.locandina}`)}
            alt={evento.titolo}
            className="event-thumbnail"
          />
        )}
        <div className="event-details">
          <p className="event-date">
            <strong>When:</strong> {new Date(evento.data).toLocaleString()}
          </p>
          <h2 className="event-title">{evento.titolo}</h2>
          <p className="event-location">
            <strong>Where:</strong> {evento.luogo}
          </p>
          {evento.lineup && (
            <p className="event-lineup">
              <strong>Line-up:</strong> {evento.lineup}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PastEvents;