const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    titolo: {
      type: String,
      required: [true, "Il titolo è obbligatorio"],
      trim: true,
      minlength: [3, "Il titolo deve avere almeno 3 caratteri"],
      maxlength: [100, "Il titolo non può superare i 100 caratteri"],
    },
    data: {
      type: Date,
      required: [true, "La data è obbligatoria"],
      validate: {
        validator: function (value) {
          return value > new Date(); // Assicura che la data sia futura
        },
        message: "La data deve essere nel futuro",
      },
    },
    luogo: {
      type: String,
      required: [true, "Il luogo è obbligatorio"],
      trim: true,
      minlength: [3, "Il luogo deve avere almeno 3 caratteri"],
      maxlength: [100, "Il luogo non può superare i 100 caratteri"],
    },
    locandina: {
      type: String, // La locandina è salvata come percorso nella cartella uploads
      trim: true,
      validate: {
        validator: function (value) {
          return /^.*\.(jpg|jpeg|png|webp|gif)$/i.test(value); // Controlla estensioni valide
        },
        message: "Il file deve essere un'immagine valida (jpg, png, webp, gif)",
      },
    },
    buyTicketsLink: {
      type: String,
      required: [true, "Il link per l'acquisto dei biglietti è obbligatorio"],
      trim: true,
      validate: {
        validator: function (value) {
          const urlPattern = new RegExp(/^(http|https):\/\/[^ "]+$/);
          return urlPattern.test(value); // Assicura che sia un URL valido
        },
        message: "Inserisci un URL valido per il link dei biglietti",
      },
    },
    lineup: {
      type: String,
      required: [true, "La lineup è obbligatoria"],
      trim: true,
      minlength: [3, "La lineup deve avere almeno 3 caratteri"],
    },
    archiviato: {
      type: Boolean,
      default: false, // Campo per archiviare eventi passati
    },
  },
  { timestamps: true } // Aggiunge campi createdAt e updatedAt automaticamente
);

module.exports = mongoose.model("Event", eventSchema);