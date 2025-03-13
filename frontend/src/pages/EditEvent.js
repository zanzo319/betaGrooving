import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Per accedere all'ID dell'evento
import AdminNav from "../components/AdminNav"; // Menu fisso
import "../styles/EditEvent.css"; // Stile personalizzato

const EditEvent = () => {
    const { id } = useParams(); // Ottieni l'ID dell'evento dalla URL
    const navigate = useNavigate();
    const [eventData, setEventData] = useState(null);
    const [titolo, setTitolo] = useState("");
    const [data, setData] = useState("");
    const [luogo, setLuogo] = useState("");
    const [buyTicketsLink, setBuyTicketsLink] = useState("");
    const [locandina, setLocandina] = useState(null);
    const [lineup, setLineup] = useState(""); // Campo aggiunto
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        // Recupera i dati dell'evento da modificare
        const fetchEvent = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/eventi/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error("Errore nel recupero dell'evento");
                }
                setEventData(data); // Imposta i dati dell'evento
                setTitolo(data.titolo);
                setData(data.data);
                setLuogo(data.luogo);
                setBuyTicketsLink(data.buyTicketsLink);
                setLineup(data.lineup || ""); // Lineup predefinito
            } catch (err) {
                console.error("Errore durante il recupero dell'evento:", err);
                setError("Impossibile caricare i dati dell'evento");
            }
        };
        fetchEvent();
    }, [id, token]);

    const handleFileChange = (e) => {
        setLocandina(e.target.files[0]);
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
    
        if (!titolo || !data || !luogo || !buyTicketsLink || !lineup) {
            setError("Tutti i campi sono obbligatori!");
            return;
        }
    
        const formData = new FormData();
        formData.append("titolo", titolo);
        formData.append("data", data);
        formData.append("luogo", luogo);
        formData.append("buyTicketsLink", buyTicketsLink);
        formData.append("lineup", lineup);
        if (locandina) {
            formData.append("locandina", locandina);
        }
    
        try {
            const response = await fetch(`http://localhost:8080/api/eventi/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`, // Rimuovi Content-Type
                },
                body: formData, // Passa il formData come corpo della richiesta
            });
    
            if (!response.ok) {
                throw new Error("Errore durante l'aggiornamento dell'evento");
            }
    
            const updatedEvent = await response.json();
            console.log("Evento aggiornato con successo:", updatedEvent);
            setSuccess("Evento aggiornato con successo!");
            setTimeout(() => navigate("/admin-dashboard/event-list"), 1500); // Reindirizzamento
        } catch (err) {
            console.error("Errore durante l'aggiornamento dell'evento:", err);
            setError("Impossibile aggiornare l'evento");
        }
    };    

    if (!eventData) {
        return <p>Caricamento in corso...</p>; // Messaggio di caricamento
    }

    return (
        <div>
            <AdminNav /> {/* Menu fisso */}
            <div className="edit-event-container">
                <h2>Modifica Evento</h2>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <form onSubmit={handleUpdateEvent}>
                    <label>
                        Titolo:
                        <input
                            type="text"
                            value={titolo}
                            onChange={(e) => setTitolo(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Data:
                        <input
                            type="date"
                            value={data.split("T")[0]} // Mostra solo la parte della data
                            onChange={(e) => setData(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Luogo:
                        <input
                            type="text"
                            value={luogo}
                            onChange={(e) => setLuogo(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Link evento:
                        <input
                            type="text"
                            value={buyTicketsLink}
                            onChange={(e) => setBuyTicketsLink(e.target.value)}
                            placeholder="Inserisci il link per l'acquisto dei biglietti"
                            required
                        />
                    </label>

                    <label>
                        Line-up:
                        <textarea
                            value={lineup}
                            onChange={(e) => setLineup(e.target.value)}
                            placeholder="Inserisci la line-up dell'evento"
                            required
                        ></textarea>
                    </label>

                    <label>
                        Locandina:
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                    </label>

                    <button type="submit">Aggiorna Evento</button>
                </form>
            </div>
        </div>
    );
};

export default EditEvent;