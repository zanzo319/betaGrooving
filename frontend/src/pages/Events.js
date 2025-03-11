import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async"; // Importa Helmet per i meta tag dinamici
import axios from "axios";
import EventHighlight from "../components/EventHighlight";
import EventCard from "../components/EventCard";
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
        <div className="events-page flex flex-col items-center bg-gray-100 min-h-screen px-4 py-8">
            {/* Meta tag per la pagina degli eventi */}
            <Helmet>
                <title>Upcoming Events - Grooving</title>
                <meta
                    name="description"
                    content="Explore upcoming events organized by Grooving. Discover the latest line-ups, venues, and exciting music performances near you."
                />
                <meta
                    name="keywords"
                    content="grooving events, live music, concerts, upcoming events, tickets, underground music"
                />
                <meta name="author" content="Grooving Team" />
                <meta property="og:title" content="Upcoming Events - Grooving" />
                <meta
                    property="og:description"
                    content="Don't miss Grooving's latest events and musical experiences. Check the schedule and book your tickets today!"
                />
                <meta property="og:image" content="/images/og-events.png" />
                <meta property="og:url" content="http://yourdomain.com/events" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            {/* Titolo */}
            <h1 className="page-title text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">
                UPCOMING EVENTS
            </h1>

            {/* Messaggio di errore */}
            {error && (
                <p className="text-red-500 text-center text-lg mb-4">
                    {error}
                </p>
            )}

            {/* Evento in evidenza */}
            {eventoInEvidenza && (
                <div className="w-full max-w-4xl mb-8">
                    <EventHighlight evento={eventoInEvidenza} />
                </div>
            )}

            {/* Lista degli altri eventi */}
            <div className="event-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                {altriEventi.length === 0 ? (
                    <p className="text-gray-600 text-center text-lg col-span-full">
                        No other events scheduled.
                    </p>
                ) : (
                    altriEventi.map(evento => (
                        <EventCard key={evento._id || evento.titolo} evento={evento} />
                    ))
                )}
            </div>
        </div>
    );
};

export default Events;