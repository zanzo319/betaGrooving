const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Event = require("../models/eventModel");
const bcrypt = require("bcrypt");
const router = express.Router();

// Secret per JWT
const JWT_SECRET = process.env.JWT_SECRET || "jwtsegretissimo";

// Middleware per verificare il token JWT
let tokenBlacklist = []; // Lista temporanea in memoria
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ message: "Token non fornito" });
    }

    // Controlla se il token è nella blacklist
    if (tokenBlacklist.includes(token)) {
        return res.status(401).json({ message: "Token invalidato, effettuare nuovamente il login" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        console.log("Dati decodificati nel middleware verifyToken:", req.user);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token non valido" });
    }
};

// Middleware per verificare il ruolo admin
const verifyAdmin = (req, res, next) => {
    console.log("Ruolo verificato nel middleware verifyAdmin:", req.user.role);
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Non hai i permessi per eseguire questa azione" });
    }
    next();
};

// Configurazione Multer per caricamento locandine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Verifica che il file caricato sia un'immagine valida
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Solo file immagine sono permessi"), false);
    }
};

const upload = multer({ storage, fileFilter });

// Middleware per validare ObjectId di MongoDB
const validateObjectId = (req, res, next) => {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "ID non valido" });
    }
    next();
};

// Rotta per il login admin
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ message: "Username e password sono obbligatori" });
        }

        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(401).json({ message: "Username o password errati" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: "Username o password errati" });

        // Includi il ruolo nel token JWT
        const token = jwt.sign(
            { id: admin._id, username: admin.username, role: admin.role }, 
            JWT_SECRET, 
            { expiresIn: "12h" }
            
        );
        res.json({ message: "Login effettuato con successo", token });
    } catch (error) {
        console.error("Errore durante il login:", error);
        res.status(500).json({ message: "Errore interno nel login" });
    }
});

// Rotta gestione logout con inserimento token nella blacklist
router.post("/logout", (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (token) {
        tokenBlacklist.push(token);
    }
    res.json({ message: "Logout effettuato con successo" });
});

// Creazione di un nuovo evento (protetto)
router.post("/create-event", verifyToken, verifyAdmin, upload.single("locandina"), async (req, res) => {
    try {
        console.log("Richiesta ricevuta per creare un evento"); // Log per debug
        const { titolo, data, luogo, bigliettiDisponibili, lineup } = req.body;
        const locandina = req.file ? req.file.filename : null;

        // Controllo sui campi
        if (!titolo || !data || !luogo || !bigliettiDisponibili || !lineup) {
            return res.status(400).json({ message: "Tutti i campi sono obbligatori" });
        }

        if (bigliettiDisponibili < 0) {
            return res.status(400).json({ message: "I biglietti disponibili non possono essere negativi" });
        }

        const evento = new Event({ titolo, data, luogo, locandina, bigliettiDisponibili, lineup });
        await evento.save();

        res.status(201).json({ message: "Evento creato con successo", evento });
    } catch (error) {
        console.error("Errore durante la creazione dell'evento:", error); // Log dettagliato dell'errore
        res.status(500).json({ message: "Errore interno durante la creazione dell'evento", error });
    }
});

// Eliminazione evento (protetto e limitato agli admin)
router.delete("/:id", verifyToken, verifyAdmin, validateObjectId, async (req, res) => {
    console.log("Rotta DELETE chiamata per l'ID:", req.params.id);
    try {
        const evento = await Event.findById(req.params.id);
        if (!evento) {
            return res.status(404).json({ message: "Evento non trovato" });
        }

        await evento.deleteOne(); // Elimina definitivamente l'evento
        res.json({ message: "Evento eliminato con successo" });
    } catch (error) {
        console.error("Errore durante l'eliminazione dell'evento:", error);
        res.status(500).json({ message: "Errore nell'eliminazione dell'evento", error });
    }
});

module.exports = { router, verifyToken, verifyAdmin };