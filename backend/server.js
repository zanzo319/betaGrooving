require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const compression = require("compression");

const app = express();

// Configurazione della directory per le locandine
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Middleware per servire le immagini statiche dalla directory "uploads"
app.use("/uploads", express.static(uploadDir));

// Middleware di sicurezza
app.use(helmet());
app.use(mongoSanitize());
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Consenti richieste Cross-Origin
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware per comprimere le risposte HTTP
app.use(compression());

// Rate Limiting: previeni attacchi DDoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuti
    max: 100,
    message: "Troppe richieste, riprova più tardi.",
});
app.use(limiter);

// Secret per il token JWT
const JWT_SECRET = process.env.JWT_SECRET || "jwtsegretissimo";

// Middleware per proteggere le rotte utilizzando JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Estrai il token dall'header Authorization
    if (!token) {
        return res.status(403).json({ message: "Token non fornito" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Salva i dati del token nel req
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token non valido" });
    }
};

// Importazione delle route
const eventRoutes = require("./routes/eventRoutes");
const { router: adminRoutes } = require("./routes/adminRoutes"); 

// Associazioni delle route
app.use("/api/eventi", eventRoutes); // Route per gli eventi
app.use("/api/admin", adminRoutes); // Route per l'admin

// Integrazione Google Analytics (se necessaria)
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

// Estrai i colori dominanti dalla locandina (endpoint per immagini)
app.get("/api/extract-colors", async (req, res) => {
    const { imageName } = req.query;
    if (!imageName) {
        return res.status(400).json({ error: "Nome immagine mancante" });
    }

    try {
        const imagePath = path.join(uploadDir, imageName);
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ error: "Immagine non trovata" });
        }

        const buffer = await sharp(imagePath)
            .resize(3, 3) // Ridimensiona a una miniatura per elaborare i colori
            .toBuffer();

        const colors = [];
        for (let i = 0; i < buffer.length; i += 3) {
            const r = buffer[i];
            const g = buffer[i + 1];
            const b = buffer[i + 2];
            colors.push(`rgb(${r}, ${g}, ${b})`);
        }

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
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connesso a MongoDB"))
    .catch((err) => {
        console.error("❌ Errore connessione MongoDB:", err);
        process.exit(1); // Termina il server se non riesce a connettersi
    });

// Serve il frontend React
app.use(express.static(path.join(__dirname, "../frontend/build"))); // Serve i file statici del frontend
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// Avvio del server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server in esecuzione su http://localhost:${PORT}`));