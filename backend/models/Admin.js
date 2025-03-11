const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Definizione dello schema Admin
const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Il campo 'username' è obbligatorio"],
        unique: true,
        trim: true,
        minlength: [3, "Lo username deve avere almeno 3 caratteri"],
        maxlength: [50, "Lo username non può superare i 50 caratteri"]
    },
    password: {
        type: String,
        required: [true, "Il campo 'password' è obbligatorio"]
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "user"], // Definisci i ruoli validi
        default: "user" // Imposta un valore predefinito
    }
});

// Middleware: Hash della password prima di salvare
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        console.error("Errore durante l'hashing della password:", error);
        next(error);
    }
});

// Metodo per verificare la password
adminSchema.methods.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Esporta il modello Admin
module.exports = mongoose.model("Admin", adminSchema);