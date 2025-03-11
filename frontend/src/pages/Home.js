import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async"; // Importa Helmet per i meta tag dinamici
import axios from "axios";
import "../styles/Home.css"; // Stile specifico per la home

const Home = () => {
    const [eventoRecente, setEventoRecente] = useState(null);
    const [backgroundStyle, setBackgroundStyle] = useState({}); // Stato per il gradiente dinamico
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEventoRecente = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/eventi");

                if (response.data.length > 0) {
                    // Trova l'evento più recente
                    const eventiFuturi = response.data
                        .filter(evento => new Date(evento.data).getTime() >= new Date().getTime())
                        .sort((a, b) => new Date(a.data) - new Date(b.data));

                    if (eventiFuturi.length > 0) {
                        const evento = eventiFuturi[0];
                        setEventoRecente(evento); // Salva l'evento più recente

                        // Richiedi il gradiente dal backend
                        fetchGradientFromBackend(evento.locandina);
                    }
                }
            } catch (err) {
                console.error("Error retrieving recent event:", err);
                setError("Error loading event.");
            }
        };

        fetchEventoRecente();
    }, []);

    // Funzione per richiedere i colori dal backend e creare il gradiente
    const fetchGradientFromBackend = async (imageName) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/extract-colors?imageName=${imageName}`);
            const { colors } = response.data;

            // Combina i colori in un gradiente
            const gradient = `linear-gradient(to bottom right, ${colors.join(", ")})`;
            setBackgroundStyle({
                background: gradient, // Gradient dinamico generato
                transition: "background 0.5s ease-in-out",
            });
        } catch (err) {
            console.error("Errore durante il recupero dei colori:", err);
        }
    };

    // Funzione per lo scroll fluido alla sezione evento
    const scrollToEvent = () => {
        const eventSection = document.getElementById("latest-event-section");
        if (eventSection) {
            eventSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="home-container">
            {/* Meta tag per la homepage */}
            <Helmet>
                <title>Grooving - The Underground Sound Machine</title>
                <meta name="description" content="Join Grooving, the underground sound machine! Discover upcoming events, latest line-ups, and vibrant music experiences in your area." />
                <meta name="keywords" content="grooving, underground music, events, live music, concerts, tickets" />
                <meta name="author" content="Grooving Team" />
                <meta property="og:title" content="Grooving - The Underground Sound Machine" />
                <meta property="og:description" content="Stay updated with the latest underground music events and join the Grooving movement!" />
                <meta property="og:image" content="/images/og-image.png" />
                <meta property="og:url" content="http://yourdomain.com/" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            <div className="video-section">
                <div className="video-background">
                    <video autoPlay loop muted className="video">
                        <source src="/videos/about-video.webm" type="video/webm" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="content">
                    <p className="logo">GROOVING</p>
                    <p className="motto">The Underground Sound Machine</p>

                    {/* Pulsante Show Events */}
                    <div className="button-container">
                        <button className="explore-button" onClick={scrollToEvent}>
                            Show Events
                        </button>
                    </div>
                </div>
                {error && <p className="error-message">{error}</p>}
            </div>

            {eventoRecente && (
                <div
                    id="latest-event-section"
                    className="home-event-section"
                    style={backgroundStyle} // Applica il gradiente dinamico
                >
                    <img
                        src={require(`../uploads/${eventoRecente.locandina}`)} // Percorso dinamico all'immagine
                        alt={eventoRecente.titolo}
                        className="home-event-image"
                    />
                    <div className="home-event-info">
                        <h2 className="home-event-title">{eventoRecente.titolo}</h2>
                        <p className="home-event-date"><strong>When:</strong> {new Date(eventoRecente.data).toLocaleString()}</p>
                        <p className="home-event-location"><strong>Where:</strong> {eventoRecente.luogo}</p>
                        <p className="home-event-lineup"><strong>Line-up:</strong> {eventoRecente.lineup}</p>
                        {eventoRecente.biglietti && (
                            <a
                                href={eventoRecente.biglietti}
                                className="buy-ticket-button"
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