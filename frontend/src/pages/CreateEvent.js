import React, { useState } from "react";
import AdminNav from "../components/AdminNav";
import "../styles/CreateEvent.css";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
    const [titolo, setTitolo] = useState("");
    const [data, setData] = useState("");
    const [luogo, setLuogo] = useState("");
    const [buyTicketsLink, setBuyTicketsLink] = useState("");
    const [locandina, setLocandina] = useState(null);
    const [lineup, setLineup] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [formErrors, setFormErrors] = useState({
        titolo: false,
        data: false,
        luogo: false,
        buyTicketsLink: false,
        lineup: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setLocandina(e.target.files[0]);
    };

    const isValidUrl = (url) => {
        const urlPattern = new RegExp(/^(http|https):\/\/[^ "]+$/);
        return urlPattern.test(url);
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        const errors = {
            titolo: !titolo,
            data: !data,
            luogo: !luogo,
            buyTicketsLink: !buyTicketsLink || !isValidUrl(buyTicketsLink),
            lineup: !lineup,
        };

        setFormErrors(errors);

        if (Object.values(errors).some((field) => field)) {
            setError("Tutti i campi sono obbligatori!");
            setIsLoading(false);
            return;
        }

        // Conversione del campo data in un oggetto Date
        const eventDate = new Date(data);

        // Verifica se la data è valida e futura
        if (isNaN(eventDate.getTime()) || eventDate <= new Date()) {
            setError("La data deve essere valida e futura.");
            setIsLoading(false);
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

        // Debug dei dati inviati
        console.log("Dati inviati al server:", {
            titolo,
            data,
            luogo,
            buyTicketsLink,
            lineup,
            locandina: locandina ? locandina.name : "Nessuna locandina",
        });

        try {
            const response = await fetch("http://localhost:8080/api/admin/create-event", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // Auth Token
                },
                body: formData,
            });

            if (!response.ok) {
                const errorDetails = await response.json(); // Leggi i dettagli dell'errore
                console.error("Errore restituito dal server:", errorDetails);
                throw new Error(errorDetails.message || "Errore durante la creazione dell'evento.");
            }

            const createdEvent = await response.json();
            console.log("Evento creato con successo:", createdEvent);
            setSuccess("Evento creato con successo!");
            setTimeout(() => navigate("/admin-dashboard/event-list"), 1500);
        } catch (err) {
            console.error("Errore durante la creazione dell'evento:", err);
            setError(err.message || "Impossibile creare l'evento");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <AdminNav />
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
                            placeholder="Inserisci il titolo dell'evento"
                            required
                        />
                        {formErrors.titolo && <span className="field-error">Campo obbligatorio</span>}
                    </label>

                    <label>
                        Data e orario:
                        <input
                            type="datetime-local"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            required
                        />
                        {formErrors.data && <span className="field-error">Campo obbligatorio</span>}
                    </label>

                    <label>
                        Luogo:
                        <input
                            type="text"
                            value={luogo}
                            onChange={(e) => setLuogo(e.target.value)}
                            placeholder="Inserisci il luogo dell'evento"
                            required
                        />
                        {formErrors.luogo && <span className="field-error">Campo obbligatorio</span>}
                    </label>

                    <label>
                        Link evento:
                        <input
                            type="text"
                            value={buyTicketsLink}
                            onChange={(e) => setBuyTicketsLink(e.target.value)}
                            placeholder="Link piattaforma d'acquisto biglietti"
                            required
                        />
                        {formErrors.buyTicketsLink && <span className="field-error">Inserisci un URL valido</span>}
                    </label>

                    <label>
                        Lineup:
                        <textarea
                            value={lineup}
                            onChange={(e) => setLineup(e.target.value)}
                            placeholder="Inserisci la lineup dell'evento"
                            required
                        ></textarea>
                        {formErrors.lineup && <span className="field-error">Campo obbligatorio</span>}
                    </label>

                    <label>
                        Locandina:
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                    </label>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Creazione in corso..." : "Crea Evento"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;