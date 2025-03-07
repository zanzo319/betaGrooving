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
          return value > new Date();
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
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          return /^.*\.(jpg|jpeg|png|webp|gif)$/i.test(value);
        },
        message: "Il file deve essere un'immagine valida (jpg, png, webp, gif)",
      },
    },
    bigliettiDisponibili: {
      type: Number,
      required: [true, "Il numero di biglietti disponibili è obbligatorio"],
      min: [0, "I biglietti disponibili non possono essere negativi"],
    },
    archiviato: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);