import React, { useState, useEffect } from "react";
import axios from "axios";
import EventHighlight from "../components/EventHighlight";
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
            <h1 className="page-title">UPCOMING EVENTS</h1>

            {error && <p className="error-message">{error}</p>}

            {eventoInEvidenza && <EventHighlight evento={eventoInEvidenza} />}

            <div className="event-list">
                {altriEventi.length === 0 ? (
                    <p className="no-events">No other events scheduled.</p>
                ) : (
                    altriEventi.map(evento => (
                        <EventCard key={evento._id || evento.titolo} evento={evento} />
                    ))
                )}
            </div>
        </div>
    );
};

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

export default Events;