require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect(process.env.URL_MONGO)
    .then(async () => {
        console.log("Connecté à MongoDB");

const existingUser = await User.findOne({ email: "admin@russell.com"});

if (existingUser) {
            console.log("L'utilisateur existe déjà");
            console.log("email", existingUser.email);
            console.log("username", existingUser.username);
            process.exit(0);
            return;
        }

const adminUser = await User.create({
    username: "admin",
    email: "admin@russell.com",
    password: "Admin123"
});

console.log("Utilisateur administrateur créé avec succès");

mongoose.connection.close();
}) .catch((err) => {
    console.error("Erreur de connexion à MongoDB", err);
    process.exit(1);
});

