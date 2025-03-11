import React from "react";
import "../styles/Events.css";

const EventCard = ({ evento }) => {
  return (
    <div className="event-card">
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
          {evento.biglietti && (
            <a href={evento.biglietti} className="buy-ticket-button" target="_blank" rel="noopener noreferrer">
              Buy Tickets
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;