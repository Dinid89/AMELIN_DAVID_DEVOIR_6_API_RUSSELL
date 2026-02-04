const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
    catwayNumber: {
        type : Number,
        trim : true,
        unique : true,
        required : [true, "Le numéro est requis"]
    },

    catwayType: {
        type : String,
        enum : ["long", "short"],
        required : [true, "Le type est requis"]
    },

    catwayState: {
        type : String,
        required : [true, "L'état est requis"]
    }
}, {
    timestamps : true
});



module.exports = mongoose.model('Catway', catwaySchema);



