import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/EventHighlight.css";

const EventHighlight = () => {
    const [evento, setEvento] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEventi = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/eventi"); // Corretto endpoint
                const eventiOrdinati = response.data
                    .filter(evento => new Date(evento.data).getTime() >= new Date().getTime()) // Solo eventi futuri
                    .sort((a, b) => new Date(a.data) - new Date(b.data)); // Ordina per data più vicina

                if (eventiOrdinati.length > 0) {
                    setEvento(eventiOrdinati[0]); // Prende il primo evento (più vicino nel tempo)
                }
            } catch (err) {
                console.error("Error retrieving featured event:", err);
                setError("Error retrieving featured event.");
            }
        };

        fetchEventi();
    }, []);

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!evento) {
        return <p className="no-event-message">No upcoming events.</p>;
    }

    return (
        <div className="event-highlight-container">
            <div className="event-highlight-card">
                <img src={`http://localhost:8080/uploads/${evento.locandina}`} alt={evento.titolo} className="event-image" />
                <div className="event-info">
                    <p className="event-date"><strong>When:</strong> {new Date(evento.data).toLocaleString()}</p>
                    <h2 className="event-title">{evento.titolo}</h2>
                    <p className="event-location"><strong>Where:</strong> {evento.luogo}</p>
                    <p className="event-lineup"><strong>Line-up:</strong> {evento.lineup}</p>
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

export default EventHighlight;