import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Home.css"; // Stile specifico per la home
import { getLatestEvent } from "./Events"; // Funzione che prende SOLO l'evento più recente

const Home = () => {
    const [eventoRecente, setEventoRecente] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEventoRecente = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/events");
                
                if (response.data.length > 0) {
                    // Trova l'evento più recente
                    const eventiFuturi = response.data
                        .filter(evento => new Date(evento.data).getTime() >= new Date().getTime())
                        .sort((a, b) => new Date(a.data) - new Date(b.data));
                    
                    if (eventiFuturi.length > 0) {
                        setEventoRecente(eventiFuturi[0]); // Prende solo il primo evento
                    }
                }
            } catch (err) {
                console.error("Error retrieving recent event:", err);
                setError("Error loading event.");
            }
        };

        fetchEventoRecente();
    }, []);

    // Funzione per lo scroll fluido alla sezione evento
    const scrollToEvent = () => {
        const eventSection = document.getElementById("latest-event-section");
        if (eventSection) {
            eventSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="home-container">
            <p className="logo">GROOVING</p>
            <p className="motto">The Underground Sound Machine</p>

            {/* Pulsante Show Events */}
            <div className="button-container">
                <button className="explore-button" onClick={scrollToEvent}>
                    Show Events
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            {eventoRecente && (
                <div id="latest-event-section" className="home-event">
                    <img 
                        src={`http://localhost:8080/uploads/${eventoRecente.locandina}`} 
                        alt={eventoRecente.titolo} 
                        className="home-event-image" 
                    />
                    <div className="home-event-details">
                        <h2 className="home-event-title">{eventoRecente.titolo}</h2>
                        <p className="home-event-date"><strong>When:</strong> {new Date(eventoRecente.data).toLocaleString()}</p>
                        <p className="home-event-location"><strong>Where:</strong> {eventoRecente.luogo}</p>
                        <p className="home-event-lineup"><strong>Line-up:</strong> {eventoRecente.lineup}</p>
                        {eventoRecente.biglietti && (
                            <a 
                                href={eventoRecente.biglietti} 
                                className="home-buy-ticket-button" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                Buy Tickets
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;