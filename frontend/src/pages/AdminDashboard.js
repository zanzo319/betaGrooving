import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
    const [eventi, setEventi] = useState([]);
    const [error, setError] = useState("");
    const [adminName, setAdminName] = useState("");
    const [editingEvento, setEditingEvento] = useState(null);
    const [modificaData, setModificaData] = useState({ titolo: "", data: "", luogo: "" });

    const navigate = useNavigate();
    const isAdmin = sessionStorage.getItem("isAdmin");

    useEffect(() => {
        if (!isAdmin) {
            navigate("/admin-login");
            return;
        }

        fetchAdminName();
        fetchEventi();
    }, [isAdmin, navigate]);

        const fetchAdminName = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/admin", {
                headers: { Authorization: `Bearer ${isAdmin}` },
            });

            if (response.status === 401) {
                sessionStorage.removeItem("isAdmin");
                navigate("/admin-login");
                return;
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Errore nel recupero del nome admin");
                setAdminName(data.username);
            } else {
                throw new Error("Risposta non valida dal server");
            }
        } catch (error) {
            setError(error.message);
        }
    };

        const fetchEventi = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/eventi", {
                headers: { Authorization: `Bearer ${isAdmin}` },
            });

            if (response.status === 401) {
                sessionStorage.removeItem("isAdmin");
                navigate("/admin-login");
                return;
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Errore nel recupero eventi");

                const eventiOrdinati = data
                    .filter(evento => new Date(evento.data) > new Date())
                    .sort((a, b) => new Date(a.data) - new Date(b.data));

                setEventi(eventiOrdinati);
            } else {
                throw new Error("Risposta non valida dal server");
            }
        } catch (error) {
            setError(error.message);
        }
    };

        const handleEdit = (evento) => {
        setEditingEvento(evento._id);
        setModificaData({
            titolo: evento.titolo,
            data: new Date(evento.data).toISOString().split("T")[0],
            luogo: evento.luogo,
        });
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/eventi/${editingEvento}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${isAdmin}`,
                },
                body: JSON.stringify(modificaData),
            });

            if (!response.ok) throw new Error("Errore nella modifica evento");

            setEditingEvento(null);
            fetchEventi();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Sei sicuro di voler eliminare questo evento?")) {
            try {
                const response = await fetch(`http://localhost:8080/api/eventi/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${isAdmin}` },
                });

                if (!response.ok) throw new Error("Errore nell'eliminazione evento");

                fetchEventi();
            } catch (error) {
                console.error(error);
            }
        }
    };

        const handleLogout = () => {
        sessionStorage.removeItem("isAdmin");
        navigate("/admin-login");
    };

    return (
        <div className="admin-dashboard">
            <nav className="admin-nav">
                <h2>Admin Panel</h2>
                <ul>
                    <li><Link to="/admin-dashboard">Dashboard</Link></li>
                    <li><Link to="create-event">Crea Evento</Link></li>
                    <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
                </ul>
            </nav>

            <div className="admin-content">
                <h2>Benvenuto, {adminName}</h2>

                {error && <p className="error">{error}</p>}

                <Outlet /> {/* Qui vengono caricate pagine come CreateEvent.js */}

                <h3>Prossimo Evento in Programma</h3>
                {eventi.length === 0 ? (
                    <p>Nessun evento disponibile.</p>
                ) : (
                    <div className="evento">
                        <h3>{eventi[0].titolo}</h3>
                        <p><strong>Data:</strong> {new Date(eventi[0].data).toLocaleDateString()}</p>
                        <p><strong>Luogo:</strong> {eventi[0].luogo}</p>
                        {eventi[0].locandina && (
                            <img src={`http://localhost:8080/uploads/${eventi[0].locandina}`} alt="Locandina" />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
