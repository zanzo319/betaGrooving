import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import "../styles/Events.css";

const Events = () => {
    const [eventi, setEventi] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEventi = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/eventi");

                if (!Array.isArray(response.data)) {
                    throw new Error("Dati non validi ricevuti dal server");
                }

                const eventiFuturi = response.data
                    .filter(evento => new Date(evento.data).getTime() >= new Date().getTime())
                    .sort((a, b) => new Date(a.data) - new Date(b.data));

                setEventi(eventiFuturi);
            } catch (err) {
                console.error("Errore nel recupero degli eventi:", err);
                setError("Errore nel recupero degli eventi.");
            }
        };

        fetchEventi();
    }, []);

    const eventoInEvidenza = eventi.length > 0 ? eventi[0] : null;
    const altriEventi = eventoInEvidenza ? eventi.slice(1) : [];

    return (
        <div className="events-page">
            <Helmet>
                <title>Upcoming Events - Grooving</title>
                <meta
                    name="description"
                    content="Explore upcoming events organized by Grooving. Discover the latest line-ups, venues, and exciting music performances near you."
                />
            </Helmet>

            <h1 className="event-page-title">UPCOMING EVENTS</h1>

            {error && <p className="error-message">{error}</p>}

            {eventoInEvidenza && (
                <div className="event-highlight">
                    <img
                        src={`http://localhost:8080/uploads/${eventoInEvidenza.locandina}`}
                        alt={eventoInEvidenza.titolo}
                        className="highlight-image"
                    />
                    <div className="event-text-details">
                        <h2>{eventoInEvidenza.titolo}</h2>
                        <p><strong>Date:</strong> {new Date(eventoInEvidenza.data).toLocaleString()}</p>
                        <p><strong>Location:</strong> {eventoInEvidenza.luogo}</p>
                        <p><strong>Line-up:</strong> {eventoInEvidenza.lineup}</p>
                        <div className="event-buy-ticket">
                            <a
                                href={eventoInEvidenza.buyTicketsLink}
                                className="event-buy-ticket-button"
                                target="_blank"
                                rel="noopener noreferrer"
                            >Buy Tickets</a>
                        </div>
                    </div>
                </div>
            )}

            <div className="event-list">
                {altriEventi.length === 0 ? (
                    <p className="no-events">No other events scheduled.</p>
                ) : (
                    altriEventi.map(evento => (
                        <div key={evento._id || evento.titolo} className="event-card">
                            <img
                                src={`http://localhost:8080/uploads/${evento.locandina}`}
                                alt={evento.titolo}
                                className="event-thumbnail"
                            />
                            <h3 className="event-title">{evento.titolo}</h3>
                            <p className="event-date"><strong>Date:</strong> {new Date(evento.data).toLocaleString()}</p>
                            <p className="event-location"><strong>Location:</strong> {evento.luogo}</p>
                            <p className="event-lineup"><strong>Line-up:</strong> {evento.lineup}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Events;