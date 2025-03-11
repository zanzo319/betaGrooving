require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const compression = require("compression"); // Aggiunto per comprimere le risposte HTTP (migliora performance SEO)

const app = express();

// Creazione della cartella uploads se non esiste
const uploadDir = path.join(__dirname, "../frontend/src/uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Servire le immagini statiche dalla nuova posizione
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware di sicurezza
app.use(helmet());
app.use(mongoSanitize());
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Consenti cookie di sessione
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware per comprimere le risposte HTTP
app.use(compression());

// Rate Limiting (protezione da attacchi DDoS)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuti
    max: 100,
    message: "Troppe richieste, riprova più tardi.",
});
app.use(limiter);

// Configurazione sessioni per l'admin
app.use(
    session({
        secret: process.env.SESSION_SECRET || "supersegreto", // Usa una variabile d'ambiente per il segreto
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Metti "true" se usi HTTPS
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 2, // 2 ore
        },
    })
);

// Importazione delle route
const eventRoutes = require("./routes/eventRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/eventi", eventRoutes);
app.use("/api/admin", adminRoutes);

// Integrazione Google Analytics (aggiungi lo script al frontend)
app.get("/api/analytics", (req, res) => {
    res.send(
        `<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
         <script>
           window.dataLayer = window.dataLayer || [];
           function gtag(){dataLayer.push(arguments);}
           gtag('js', new Date());
           gtag('config', 'GA_TRACKING_ID');
         </script>`
    );
});

// Endpoint per estrarre i colori dominanti dalla locandina
app.get("/api/extract-colors", async (req, res) => {
    const { imageName } = req.query; // Nome immagine passato come query param
    if (!imageName) {
        return res.status(400).json({ error: "Nome immagine mancante" });
    }

    try {
        const imagePath = path.join(uploadDir, imageName); // Percorso completo dell'immagine

        // Verifica se l'immagine esiste
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ error: "Immagine non trovata" });
        }

        // Riduci l'immagine a una miniatura per prelevare più colori (es. 3x3 pixel)
        const buffer = await sharp(imagePath)
            .resize(3, 3) // Riduci a una griglia di 3x3 pixel
            .toBuffer();

        // Estrai tutti i pixel della griglia come colori RGB
        const colors = [];
        for (let i = 0; i < buffer.length; i += 3) {
            const r = buffer[i];
            const g = buffer[i + 1];
            const b = buffer[i + 2];
            colors.push(`rgb(${r}, ${g}, ${b})`);
        }

        // Risposta con più colori
        res.json({ colors });
    } catch (err) {
        console.error("Errore durante l'estrazione dei colori:", err);
        res.status(500).json({ error: "Errore durante l'elaborazione dell'immagine" });
    }
});

// Connessione a MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose.set("strictQuery", false);
mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ Connesso a MongoDB"))
    .catch((err) => {
        console.error("❌ Errore connessione MongoDB:", err);
        process.exit(1);
    });

// Serve il frontend React con URL puliti
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// Avvio del server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server in esecuzione su http://localhost:${PORT}`));