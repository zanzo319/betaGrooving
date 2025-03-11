const express = require("express");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

const router = express.Router();

// **Login Admin con sessione**
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Valida i dati in ingresso
        if (!username || !password) {
            return res.status(400).json({ message: "Username e password sono obbligatori" });
        }

        // Trova l'admin con il nome utente fornito
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(401).json({ message: "Username o password errati" });

        // Confronta la password fornita con quella memorizzata
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: "Username o password errati" });

        // Salva l'admin nella sessione
        req.session.admin = { id: admin._id, username: admin.username };
        res.json({ message: "Login effettuato con successo", username: admin.username });
    } catch (error) {
        console.error("Errore durante il login:", error);
        res.status(500).json({ message: "Errore interno nel login" });
    }
});

// **Verifica se l'admin è autenticato**
router.get("/", (req, res) => {
    if (req.session.admin) {
        res.json({ username: req.session.admin.username });
    } else {
        res.status(401).json({ message: "Non autenticato" });
    }
});

// **Logout Admin**
router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Errore durante il logout:", err);
            return res.status(500).json({ message: "Errore interno nel logout" });
        }
        res.clearCookie("connect.sid"); // Cancella il cookie della sessione
        res.json({ message: "Logout effettuato con successo" });
    });
});

module.exports = router;