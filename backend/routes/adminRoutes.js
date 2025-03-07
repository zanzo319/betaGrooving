const express = require("express");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

const router = express.Router();

// **Login Admin con sessione**
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(401).json({ message: "Username o password errati" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: "Username o password errati" });

        // Salviamo l'admin nella sessione
        req.session.admin = { id: admin._id, username: admin.username };
        res.json({ message: "Login effettuato con successo" });
    } catch (error) {
        res.status(500).json({ message: "Errore nel login" });
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
        if (err) return res.status(500).json({ message: "Errore nel logout" });
        res.json({ message: "Logout effettuato" });
    });
});

module.exports = router;
