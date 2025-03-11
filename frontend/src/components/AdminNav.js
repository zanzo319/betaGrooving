import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminNav.css";

const AdminNav = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        console.log("Il bottone Logout è stato cliccato");
    
        // Recupera il token dal sessionStorage
        const token = sessionStorage.getItem("token");
        console.log("Token prima del logout:", token);
    
        // Rimuovi il token dal sessionStorage
        sessionStorage.removeItem("token");
        console.log("Token dopo il logout:", sessionStorage.getItem("token")); // Deve essere null
    
        try {
            // Effettua la chiamata al backend per completare il logout
            const response = await fetch("http://localhost:8080/api/admin/logout", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`, // Passa il token JWT nel header
                },
            });
            console.log("Stato della risposta del logout:", response.status); // Deve essere 200
    
            if (response.ok) {
                // Reindirizza alla pagina di login
                navigate("/admin-login");
            } else {
                console.error("Errore durante il logout dal server");
            }
        } catch (err) {
            console.error("Errore nella richiesta di logout:", err);
        }
    };    

    return (
        <nav className="admin-nav">
            <h2>GROOVING CONTROL PANEL</h2>
            <ul>
                <li><Link to="/admin-dashboard">Dashboard</Link></li>
                <li><Link to="/admin-dashboard/create-event">Crea Evento</Link></li>
                <li><Link to="/admin-dashboard/event-list">Lista Eventi</Link></li>
                <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
            </ul>
        </nav>
    );
};

export default AdminNav;