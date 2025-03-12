import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Aggiungi per reindirizzamenti
import AdminNav from "../components/AdminNav";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
    const [eventi, setEventi] = useState([]);
    const [adminName, setAdminName] = useState("");
    const navigate = useNavigate(); // Hook per il reindirizzamento

    useEffect(() => {
        const verifyToken = async () => {
            const token = sessionStorage.getItem("token");
            if (!token) {
                navigate("/admin-login");
                return;
            }

            try {
                const response = await fetch("http://localhost:8080/api/admin/verify-token", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error("Token non valido");
                }

                const data = await response.json();
                console.log("Token valido. Utente:", data.user);
                setAdminName(data.user.username); // Opzionale: Imposta il nome admin
            } catch (error) {
                console.error("Errore durante la verifica del token:", error);
                sessionStorage.removeItem("token"); // Rimuovi il token non valido
                navigate("/admin-login"); // Reindirizza al login
            }
        };

        verifyToken();
        fetchEventi();
    }, [navigate]);

    const fetchEventi = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/eventi", {
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
            });
            const data = await response.json();
            const eventiRecenti = data
                .filter((evento) => new Date(evento.data) > new Date())
                .sort((a, b) => new Date(a.data) - new Date(b.data))
                .slice(0, 3);
            setEventi(eventiRecenti);
        } catch (error) {
            console.error("Errore durante il recupero degli eventi:", error);
        }
    };

    return (
        <div>
            <AdminNav />
            <div className="admin-dashboard">
                {/* Se vuoi abilitare il messaggio di benvenuto */}
                {/* <h2>Benvenuto, {adminName}</h2> */}
                <section className="eventi-prossimi">
                    <h3>Prossimi Eventi</h3>
                    {eventi.length === 0 ? (
                        <p>Nessun evento disponibile.</p>
                    ) : (
                        <div className="eventi-grid">
                            {eventi.map((evento) => (
                                <div key={evento._id} className="evento-card">
                                    <h4>{evento.titolo}</h4>
                                    <p><strong>Data:</strong> {new Date(evento.data).toLocaleDateString()}</p>
                                    <p><strong>Luogo:</strong> {evento.luogo}</p>
                                    {evento.locandina && (
                                        <img
                                            src={`http://localhost:8080/uploads/${evento.locandina}`}
                                            alt="Locandina"
                                            className="evento-locandina"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    <a href="/admin-dashboard/event-list" className="link-completo">Visualizza tutti gli eventi</a>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;