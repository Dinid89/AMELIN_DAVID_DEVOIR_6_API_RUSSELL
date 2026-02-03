require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect(process.env.URL_MONGO)
  .then(async () => {
    console.log("✅ Connecté à MongoDB");

    const existingUser = await User.findOne({ email: "admin@russell.com" });

    if (existingUser) {
      console.log("⚠️ L'utilisateur existe déjà");
      console.log("Email:", existingUser.email);
      console.log("Username:", existingUser.username);
      mongoose.connection.close();
      return;
    }

    // Créer l'utilisateur
    const adminUser = await User.create({
      username: "admin",
      email: "admin@russell.com",
      password: "Admin123!"
    });

    console.log("✅ Utilisateur créé avec succès !");
    console.log("─────────────────────────────");
    console.log("📧 Email:", adminUser.email);
    console.log("👤 Username:", adminUser.username);
    console.log("🔑 Password: Admin123!");
    console.log("─────────────────────────────");

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à MongoDB", err);
    process.exit(1);
  });