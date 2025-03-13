import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import "../styles/Home.css";

const Home = () => {
    const [eventiFuturi, setEventiFuturi] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEventiFuturi = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/eventi");

                if (response.data.length > 0) {
                    const eventi = response.data
                        .filter(evento => new Date(evento.data).getTime() >= new Date().getTime())
                        .sort((a, b) => new Date(a.data) - new Date(b.data));

                    setEventiFuturi(eventi); // Salva tutti gli eventi futuri
                }
            } catch (err) {
                console.error("Errore durante il recupero degli eventi:", err);
                setError("Errore durante il caricamento degli eventi.");
            }
        };

        fetchEventiFuturi();
    }, []);

    return (
        <div className="home-container">
            {/* Meta tag per la homepage */}
            <Helmet>
                <title>Grooving - The Underground Sound Machine</title>
                <meta name="description" content="Join Grooving, the underground sound machine!" />
            </Helmet>

            {/* Sezione Video, Logo e Motto */}
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
                    <div className="button-container">
                        <button
                            className="explore-button"
                            onClick={() =>
                                document.getElementById("events-section").scrollIntoView({
                                    behavior: "smooth",
                                })
                            }
                        >
                            Show Events
                        </button>
                    </div>
                </div>
            </div>

                        {/* Sezione Evento Futuro */}
                        <div id="events-section" className="home-event-section">
                <h2 className="event-section-title">UPCOMING EVENTS</h2>

                {eventiFuturi.length > 0 && (
                    <div className="single-event">
                        <img
                            src={`http://localhost:8080/uploads/${eventiFuturi[0].locandina}`}
                            alt={eventiFuturi[0].titolo}
                            className="event-image-large"
                        />
                        <div className="event-info-large">
                            <h2>{eventiFuturi[0].titolo}</h2>
                            <p><strong>When:</strong> {new Date(eventiFuturi[0].data).toLocaleString()}</p>
                            <p><strong>Where:</strong> {eventiFuturi[0].luogo}</p>
                            <p><strong>Line-up:</strong> {eventiFuturi[0].lineup}</p>
                            <div className="event-buy-tickets-button">
                                <a href={eventiFuturi[0].buyTicketsLink}
                                className="buy-tickets-button"
                                target="_blank"
                                rel="noopener noreferrer"
                                >Buy Tickets</a>
                            </div>
                        </div>
                    </div>
                )}

                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default Home;