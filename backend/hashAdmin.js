const bcrypt = require("bcryptjs");

const hashPassword = async () => {
    const password = "admin123"; // Cambia la password se vuoi
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Password hashata:", hashedPassword);
};

hashPassword();