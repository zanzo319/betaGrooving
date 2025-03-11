import React, { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav"; // Menu fisso
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
    const [eventi, setEventi] = useState([]);
    const [adminName, setAdminName] = useState("");

    useEffect(() => {
        // Simulazione: Recupera gli ultimi eventi e il nome admin
        fetchEventi();
        setAdminName("admin");
    }, []);

    const fetchEventi = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/eventi", {
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
            });
            const data = await response.json();
            const eventiRecenti = data
                .filter((evento) => new Date(evento.data) > new Date())
                .sort((a, b) => new Date(a.data) - new Date(b.data))
                .slice(0, 3); // Mostra solo 3 eventi
            setEventi(eventiRecenti);
        } catch (error) {
            console.error("Errore durante il recupero degli eventi:", error);
        }
    };

    return (
        <div>
            <AdminNav /> {/* Menu sempre visibile */}
            <div className="admin-dashboard">
                {/* <h2>Benvenuto, {adminName}</h2> per ora lasciamolo commentato */} 
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