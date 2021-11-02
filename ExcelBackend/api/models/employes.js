const mongoose = require('mongoose');

const employesSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    employeName: {
        type: String,
        required: true
    },

    lastSelected: {
        type: String,
        default: "--/--/----"
    },

    isSelectedAfterLastReset: {
        type: Boolean,
        default: false
    },


    company: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Auth"
    }

});


module.exports = mongoose.model('Employe', employesSchema);