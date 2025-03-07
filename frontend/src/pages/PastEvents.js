import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/PastEvents.css";

const PastEvents = () => {
  const [eventiPassati, setEventiPassati] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEventiPassati = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/eventi");

        if (!Array.isArray(response.data)) {
          throw new Error("Dati non validi ricevuti dal server");
        }

        const eventiPassati = response.data
          .filter(evento => new Date(evento.data).getTime() < new Date().getTime())
          .sort((a, b) => new Date(b.data) - new Date(a.data));

        setEventiPassati(eventiPassati);
      } catch (err) {
        console.error("Errore nel recupero degli eventi passati:", err);
        setError("Errore nel recupero degli eventi passati.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventiPassati();
  }, []);

  return (
    <div className="eventi-passati-container">
      <h1>PAST EVENTS</h1>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p className="loading-message">Loading events...</p>
      ) : (
        <div className="past-event-list">
          {eventiPassati.length === 0 ? (
            <p className="no-events">No past events found.</p>
          ) : (
            eventiPassati.map(evento => (
              <EventCard key={evento._id || evento.titolo} evento={evento} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const EventCard = ({ evento }) => {
  return (
    <div className="evento">
      <div className="event-content">
        {evento.locandina && (
          <img
            src={`http://localhost:8080/uploads/${evento.locandina}`}
            alt={evento.titolo}
            className="event-thumbnail"
          />
        )}

        <div className="event-details">
          <p className="event-date"><strong>When:</strong> {new Date(evento.data).toLocaleString()}</p>
          <h2 className="event-title">{evento.titolo}</h2>
          <p className="event-location"><strong>Where:</strong> {evento.luogo}</p>
          {evento.lineup && <p className="event-lineup"><strong>Line-up:</strong> {evento.lineup}</p>}
        </div>
      </div>
    </div>
  );
};

export default PastEvents;
