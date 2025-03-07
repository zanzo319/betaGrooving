const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Event = require("../models/eventModel");

const router = express.Router();

// Middleware per verificare se l'admin è autenticato
const verifyAdminSession = (req, res, next) => {
    if (!req.session || !req.session.adminId) {
        return res.status(403).json({ message: "Accesso non autorizzato" });
    }
    next();
};

// Configurazione upload locandina
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
const upload = multer({ storage });

// Middleware di validazione ID MongoDB
const validateObjectId = (req, res, next) => {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "ID non valido" });
    }
    next();
};

// Recupera eventi pubblici
router.get("/events", async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        const filter = { archiviato: status === "archiviati" };

        if (search) {
            filter.titolo = { $regex: search, $options: "i" };
        }

        const eventi = await Event.find(filter)
            .skip((page - 1) * parseInt(limit))
            .limit(parseInt(limit));

        res.json(eventi);
    } catch (error) {
        res.status(500).json({ message: "Errore nel recupero degli eventi", error });
    }
});

// Recupera tutti gli eventi (aggiunta nuova rotta)
router.get("/", async (req, res) => {
    try {
        const eventi = await Event.find();
        res.json(eventi);
    } catch (error) {
        res.status(500).json({ message: "Errore nel recupero degli eventi", error });
    }
});

// Creazione evento (protetta)
router.post("/admin-dashboard/create-event", verifyAdminSession, upload.single("locandina"), async (req, res) => {
    try {
        const { titolo, data, luogo, bigliettiDisponibili } = req.body;
        const locandina = req.file ? req.file.filename : null;

        if (bigliettiDisponibili < 0) {
            return res.status(400).json({ message: "I biglietti disponibili non possono essere negativi" });
        }

        const evento = new Event({ titolo, data, luogo, locandina, bigliettiDisponibili });
        await evento.save();
        res.status(201).json({ message: "Evento aggiunto con successo", evento });
    } catch (error) {
        res.status(500).json({ message: "Errore nella creazione dell'evento", error });
    }
});
// Modifica evento
router.put("/admin-dashboard/:id", verifyAdminSession, validateObjectId, upload.single("locandina"), async (req, res) => {
    try {
        const { titolo, data, luogo, bigliettiDisponibili } = req.body;
        const evento = await Event.findById(req.params.id);

        if (!evento) return res.status(404).json({ message: "Evento non trovato" });

        if (bigliettiDisponibili < 0) {
            return res.status(400).json({ message: "I biglietti disponibili non possono essere negativi" });
        }

        if (new Date(data) < new Date()) {
            return res.status(400).json({ message: "La data deve essere nel futuro" });
        }

        evento.titolo = titolo;
        evento.data = data;
        evento.luogo = luogo;
        evento.bigliettiDisponibili = bigliettiDisponibili;

        if (req.file) {
            evento.locandina = req.file.filename;
        }

        await evento.save();
        res.json({ message: "Evento aggiornato con successo", evento });
    } catch (error) {
        res.status(500).json({ message: "Errore nella modifica dell'evento", error });
    }
});

// Eliminazione evento
router.delete("/admin-dashboard/:id", verifyAdminSession, validateObjectId, async (req, res) => {
    try {
        const evento = await Event.findById(req.params.id);
        if (!evento) return res.status(404).json({ message: "Evento non trovato" });

        await evento.deleteOne();
        res.json({ message: "Evento eliminato con successo" });
    } catch (error) {
        res.status(500).json({ message: "Errore nell'eliminazione dell'evento", error });
    }
});

// Recupera un evento specifico
router.get("/:id", validateObjectId, async (req, res) => {
    try {
        const evento = await Event.findById(req.params.id);
        if (!evento) return res.status(404).json({ message: "Evento non trovato" });

        res.json(evento);
    } catch (error) {
        res.status(500).json({ message: "Errore nel recupero dell'evento", error });
    }
});

// Archivia un evento
router.put("/admin-dashboard/archivia/:id", verifyAdminSession, validateObjectId, async (req, res) => {
    try {
        const evento = await Event.findByIdAndUpdate(req.params.id, { archiviato: true }, { new: true });
        if (!evento) return res.status(404).json({ message: "Evento non trovato" });

        res.json({ message: "Evento archiviato con successo", evento });
    } catch (error) {
        res.status(500).json({ message: "Errore nell'archiviazione dell'evento", error });
    }
});

// Ripristina un evento archiviato
router.put("/admin-dashboard/ripristina/:id", verifyAdminSession, validateObjectId, async (req, res) => {
    try {
        const evento = await Event.findByIdAndUpdate(req.params.id, { archiviato: false }, { new: true });
        if (!evento) return res.status(404).json({ message: "Evento non trovato" });

        res.json({ message: "Evento ripristinato con successo", evento });
    } catch (error) {
        res.status(500).json({ message: "Errore nel ripristino dell'evento", error });
    }
});

module.exports = router;