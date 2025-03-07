import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/EventList.css";

const EventList = () => {
    const [eventi, setEventi] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEventi = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/eventi"); // Corretto endpoint
                setEventi(response.data);
            } catch (err) {
                console.error("Error retrieving events:", err);
                setError("Error retrieving events.");
            }
        };

        fetchEventi();
    }, []);

    return (
        <div className="event-list-container">
            <h2>Lista Eventi</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="event-list">
                {eventi.length === 0 ? (
                    <p>No events available.</p>
                ) : (
                    eventi.map((evento) => (
                        <div key={evento._id} className="event-card">
                            <img src={`http://localhost:8080/uploads/${evento.locandina}`} alt={evento.titolo} />
                            <h3>{evento.titolo}</h3>
                            <p><strong>When:</strong> {new Date(evento.data).toLocaleDateString()}</p>
                            <p><strong>Where:</strong> {evento.luogo}</p>
                            <p><strong>Description:</strong> {evento.descrizione ? evento.descrizione.substring(0, 50) + "..." : "No description available."}</p>
                            <Link to={`/eventi/${evento._id}`} className="details-button">Details</Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EventList;