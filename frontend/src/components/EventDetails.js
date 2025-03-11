import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./../styles/EventDetails.css";

const EventDetails = () => {
    const { id } = useParams();
    const [evento, setEvento] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEvento = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/eventi/${id}`); // Corretto endpoint
                setEvento(response.data);
            } catch (err) {
                console.error("Error retrieving event:", err);
                setError("Error retrieving event.");
            }
        };

        fetchEvento();
    }, [id]);

    if (error) return <p className="error-message">{error}</p>;
    if (!evento) return <p>Loading...</p>;

    return (
        <div className="event-details-container">
            <img src={`../uploads/${evento.locandina}`} alt={evento.titolo} />
            <h2>{evento.titolo}</h2>
            <p><strong>When:</strong> {new Date(evento.data).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {evento.orario}</p>
            <p><strong>Where:</strong> {evento.luogo} 
                {evento.mappaLink && (
                    <a href={evento.mappaLink} target="_blank" rel="noopener noreferrer" className="map-icon">📍</a>
                )}
            </p>
            <p><strong>Price:</strong> {evento.prezzo}</p>
            <p><strong>Description:</strong> {evento.descrizione}</p>
            <p><strong>Line-up:</strong></p>
            <ul>
                {evento.lineUp?.map((artista, index) => (
                    <li key={index}>{artista}</li>
                ))}
            </ul>

            {/* Indicatore di biglietti disponibili */}
            <p className={evento.bigliettiDisponibili > 0 ? "available" : "sold-out"}>
                {evento.bigliettiDisponibili > 0 
                    ? `Tickets available: ${evento.bigliettiDisponibili}` 
                    : "Sold Out"}
            </p>

            {/* Pulsante per l'acquisto biglietti (solo se link presente) */}
            {evento.bigliettiDisponibili > 0 && evento.bigliettoLink ? (
                <a href={evento.bigliettoLink} target="_blank" rel="noopener noreferrer">
                    <button className="buy-button">Buy Tickets</button>
                </a>
            ) : (
                <button className="buy-button sold-out-button" disabled>Sold Out</button>
            )}
        </div>
    );
};

export default EventDetails;