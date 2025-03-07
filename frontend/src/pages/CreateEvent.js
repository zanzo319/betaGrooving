import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateEvent.css";

const CreateEvent = () => {
    const [titolo, setTitolo] = useState("");
    const [data, setData] = useState("");
    const [luogo, setLuogo] = useState("");
    const [bigliettiDisponibili, setBigliettiDisponibili] = useState("");
    const [locandina, setLocandina] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem("adminToken");

    const handleFileChange = (e) => {
        setLocandina(e.target.files[0]);
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!titolo || !data || !luogo || !bigliettiDisponibili) {
            setError("Tutti i campi sono obbligatori!");
            return;
        }

        const formData = new FormData();
        formData.append("titolo", titolo);
        formData.append("data", data);
        formData.append("luogo", luogo);
        formData.append("bigliettiDisponibili", bigliettiDisponibili);
        if (locandina) {
            formData.append("locandina", locandina);
        }

        try {
            const response = await fetch("http://localhost:8080/api/eventi", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.status === 401) {
                localStorage.removeItem("adminToken");
                navigate("/admin-login");
                return;
            }

            if (!response.ok) {
                throw new Error("Errore nella creazione dell'evento");
            }

            setSuccess("Evento creato con successo!");
            setTimeout(() => navigate("/admin-dashboard"), 1500);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="create-event">
            <h2>Crea un nuovo evento</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <form onSubmit={handleCreateEvent}>
                <label>
                    Titolo:
                    <input type="text" value={titolo} onChange={(e) => setTitolo(e.target.value)} required />
                </label>

                <label>
                    Data:
                    <input type="date" value={data} onChange={(e) => setData(e.target.value)} required />
                </label>

                <label>
                    Luogo:
                    <input type="text" value={luogo} onChange={(e) => setLuogo(e.target.value)} required />
                </label>

                <label>
                    Biglietti Disponibili:
                    <input type="number" value={bigliettiDisponibili} onChange={(e) => setBigliettiDisponibili(e.target.value)} required />
                </label>

                <label>
                    Locandina (opzionale):
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </label>

                <button type="submit">Crea Evento</button>
            </form>
        </div>
    );
};

export default CreateEvent;