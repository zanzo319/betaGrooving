import React, { useState } from "react";
import AdminNav from "../components/AdminNav"; 
import "../styles/CreateEvent.css";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
    const [titolo, setTitolo] = useState("");
    const [data, setData] = useState("");
    const [luogo, setLuogo] = useState("");
    const [bigliettiDisponibili, setBigliettiDisponibili] = useState("");
    const [locandina, setLocandina] = useState(null);
    const [lineup, setLineup] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setLocandina(e.target.files[0]);
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
    
        if (!titolo || !data || !luogo || !bigliettiDisponibili || !lineup) {
            setError("Tutti i campi sono obbligatori!");
            return;
        }
    
        const formData = new FormData();
        formData.append("titolo", titolo);
        formData.append("data", data);
        formData.append("luogo", luogo);
        formData.append("bigliettiDisponibili", bigliettiDisponibili);
        formData.append("lineup", lineup);
        if (locandina) {
            formData.append("locandina", locandina);
        }
    
        try {
            const response = await fetch("http://localhost:8080/api/admin/create-event", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // Rimuovi "Content-Type" per FormData
                },
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error("Errore durante la creazione dell'evento");
            }
    
            const createdEvent = await response.json();
            console.log("Evento creato con successo:", createdEvent);
            setSuccess("Evento creato con successo!");
            setTimeout(() => navigate("/admin-dashboard/event-list"), 1500); // Reindirizzamento
        } catch (err) {
            console.error("Errore durante la creazione dell'evento:", err);
            setError("Impossibile creare l'evento");
        }
    };    

    return (
        <div>
            <AdminNav /> {/* Menu fisso */}
            <div className="create-event-container">
                <h2>Crea un nuovo evento</h2>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <form onSubmit={handleCreateEvent}>
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
                            value={data}
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
                        Biglietti Disponibili:
                        <input
                            type="number"
                            min="1"
                            value={bigliettiDisponibili}
                            onChange={(e) => setBigliettiDisponibili(e.target.value)}
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

                    <button type="submit">Crea Evento</button>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;