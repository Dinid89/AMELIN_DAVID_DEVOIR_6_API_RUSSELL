const mongoose = require('mongoose');


exports.initClientDbConnection = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGO); 
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error", error);
        throw error;
    }   
};
