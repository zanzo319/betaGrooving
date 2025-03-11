import React, { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav"; // Menu fisso
import "../styles/AdminListEvent.css"; // Stile aggiornato
import { useNavigate } from "react-router-dom";

const ListEvent = () => {
    const [eventi, setEventi] = useState([]);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState(""); // Stato per la ricerca
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetchEventi();
    }, []);

    const fetchEventi = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/eventi", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error("Errore nel recupero degli eventi");
            }
            setEventi(data);
        } catch (err) {
            console.error("Errore durante il recupero degli eventi:", err);
            setError("Impossibile recuperare gli eventi dal server");
        }
    };

    const handleArchive = async (id) => {
        if (window.confirm("Sei sicuro di voler archiviare questo evento?")) {
            try {
                const response = await fetch(`http://localhost:8080/api/eventi/${id}/archive`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", 
				Authorization: `Bearer ${token}`, 
		    },
                });
		
                if (!response.ok) {
                    throw new Error("Errore nell'archiviazione dell'evento");
                }
                // Aggiorna l'evento archiviato nella lista
                const eventoArchiviato = await response.json();
                setEventi((eventi) =>
                    eventi.map((evento) =>
                        evento._id === id ? { ...evento, archiviato: true } : evento
                    )
                );
            } catch (err) {
                console.error("Errore durante l'archiviazione dell'evento:", err);
                setError("Impossibile archiviare l'evento");
            }
        }
    };
    
    const handleDelete = async (id) => {
        if (window.confirm("Sei sicuro di voler eliminare questo evento?")) {
            const token = sessionStorage.getItem("token"); // Recupera il token
            console.log("Token JWT recuperato:", token); // Log del token per debug
    
            if (!token) {
                alert("Token mancante. Effettua nuovamente il login.");
                return;
            }
    
            try {
                const response = await fetch(`http://localhost:8080/api/eventi/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }, // Invia il token nell'header
                });
                console.log("Stato della risposta:", response.status); // Log dello stato della risposta
    
                if (response.ok) {
                    alert("Evento eliminato con successo!");
                    setEventi(eventi.filter((evento) => evento._id !== id)); // Aggiorna la lista
                } else if (response.status === 403) {
                    alert("Non hai i permessi per eliminare questo evento.");
                } else {
                    throw new Error("Errore nell'eliminazione dell'evento");
                }
            } catch (err) {
                console.error("Errore nella richiesta di eliminazione:", err);
                setError("Impossibile eliminare l'evento");
            }
        }
    };
    

    const filteredEventi = eventi.filter((evento) =>
        evento.titolo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <AdminNav /> {/* Menu fisso */}
            <div className="list-event-page">
                <h2>Lista Eventi Creati</h2>
                {error && <p className="error">{error}</p>}

                {/* Barra di ricerca */}
                <input
                    type="text"
                    placeholder="Cerca per titolo..."
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Lista Eventi */}
                {filteredEventi.length === 0 ? (
                    <p className="no-events">Nessun evento trovato.</p>
                ) : (
                    <div className="eventi-grid">
                        {filteredEventi.map((evento) => (
                            <div key={evento._id} className="evento-card">
                                <div className="evento-info">
                                    <h4>{evento.titolo}</h4>
                                    <p>
                                        <strong>Data:</strong>{" "}
                                        {new Date(evento.data).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <strong>Luogo:</strong> {evento.luogo}
                                    </p>
                                    <p>
                                        <strong>Line-up:</strong> {evento.lineup || "N/A"}
                                    </p>
                                </div>
                                {evento.locandina && (
                                    <img
                                        src={`http://localhost:8080/uploads/${evento.locandina}`}
                                        alt="Locandina"
                                        className="evento-locandina"
                                    />
                                )}
                                <div className="evento-actions">
                                    <button
                                        onClick={() => navigate(`/admin-dashboard/edit-event/${evento._id}`)}
                                        className="edit-btn">
                                            Modifica
                                    </button>
                                    <button
                                        onClick={() => handleArchive(evento._id)}
                                        className="archive-btn"
                                        disabled={evento.archiviato} // Disattiva il pulsante se già archiviato
                                    >
                                        {evento.archiviato ? "Archiviato" : "Archivia"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(evento._id)}
                                        className="delete-btn"
                                    >
                                        Elimina
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListEvent;