const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Event = require("../models/eventModel");
const { verifyToken, verifyAdmin } = require("./adminRoutes"); // Import middleware
const router = express.Router();

// Configurazione per l'upload delle locandine
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

// Middleware per validare gli ID MongoDB
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

// Recupera tutti gli eventi
router.get("/", async (req, res) => {
    try {
        const eventi = await Event.find();
        res.json(eventi);
    } catch (error) {
        res.status(500).json({ message: "Errore nel recupero degli eventi", error });
    }
});

// Creazione evento (protetta)
console.log("verifyToken:", verifyToken); // Deve essere una funzione
console.log("verifyAdmin:", verifyAdmin); // Deve essere una funzione
console.log("upload.single:", upload.single); // Deve essere una funzione
router.post("/admin/create-event", verifyToken, verifyAdmin, upload.single("locandina"), async (req, res) => {
    try {
        const { titolo, data, luogo, bigliettiDisponibili, lineup } = req.body;
        const locandina = req.file ? req.file.filename : null;

        if (bigliettiDisponibili < 0) {
            return res.status(400).json({ message: "I biglietti disponibili non possono essere negativi" });
        }

        const evento = new Event({ titolo, data, luogo, locandina, bigliettiDisponibili, lineup });
        await evento.save();
        res.status(201).json({ message: "Evento aggiunto con successo", evento });
    } catch (error) {
        res.status(500).json({ message: "Errore nella creazione dell'evento", error });
    }
});

// Modifica evento
router.put("/:id", verifyToken, verifyAdmin, validateObjectId, upload.single("locandina"), async (req, res) => {
    try {
        console.log("Richiesta arrivata per modifica ID:", req.params.id); 
        const { titolo, data, luogo, bigliettiDisponibili, lineup } = req.body;
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
	    evento.lineup = lineup;

        if (req.file) {
            evento.locandina = req.file.filename;
        }

        await evento.save();
        res.json({ message: "Evento aggiornato con successo", evento });
    } catch (error) {
        console.error("Errore durante la modifica dell'evento:", error);
        res.status(500).json({ message: "Errore nella modifica dell'evento", error });
    }
});

// Eliminazione evento (protetta)
router.delete("/:id", verifyToken, verifyAdmin, validateObjectId, async (req, res) => {
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
	console.log("Richiesta arrivata per archiviazione ID:", req.params.id);
    } catch (error) {
        res.status(500).json({ message: "Errore nel recupero dell'evento", error });
    }
});

// Archivia un evento (protetta)
router.put("/:id/archive", verifyToken, verifyAdmin, validateObjectId, async (req, res) => {
    try {
        console.log("Richiesta arrivata per archiviazione ID:", req.params.id); // Posizionato correttamente
        const evento = await Event.findByIdAndUpdate(req.params.id, { archiviato: true }, { new: true });
        if (!evento) return res.status(404).json({ message: "Evento non trovato" });

        res.json({ message: "Evento archiviato con successo", evento });
    } catch (error) {
        console.error("Errore nell'archiviazione dell'evento:", error);
        res.status(500).json({ message: "Errore nell'archiviazione dell'evento", error });
    }
});

// Ripristina un evento archiviato (protetta)
router.put("/admin/ripristina/:id", verifyToken, verifyAdmin, validateObjectId, async (req, res) => {
    try {
        const evento = await Event.findByIdAndUpdate(req.params.id, { archiviato: false }, { new: true });
        if (!evento) return res.status(404).json({ message: "Evento non trovato" });

        res.json({ message: "Evento ripristinato con successo", evento });
    } catch (error) {
        res.status(500).json({ message: "Errore nel ripristino dell'evento", error });
    }
});

// Esporta il router
module.exports = router;