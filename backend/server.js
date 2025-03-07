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
const app = express();

// Creazione della cartella uploads se non esiste
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Servire le immagini statiche
app.use("/uploads", express.static(uploadDir));

// Middleware di sicurezza
app.use(helmet());
app.use(mongoSanitize());
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Consenti cookie di sessione
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Avvio del server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server in esecuzione su http://localhost:${PORT}`));