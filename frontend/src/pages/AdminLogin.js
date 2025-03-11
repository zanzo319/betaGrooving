import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json", // Per maggiore compatibilità
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Si è verificato un errore durante il login");
            }

            // Salva il token JWT in sessionStorage
            sessionStorage.setItem("token", data.token);

            alert("Login effettuato con successo!");
            navigate("/admin-dashboard"); // Reindirizzamento alla dashboard
        } catch (err) {
            console.error("Errore durante il login:", err); // Log dettagliato per debug
            setError(err.message); // Messaggio visibile all'utente
        } finally {
            setLoading(false); // Ferma il caricamento
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login">
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Inserisci il tuo username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Inserisci la tua password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Accesso in corso..." : "Login"}
                    </button>
                    {error && <p className="error">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;