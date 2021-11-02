const mongoose = require('mongoose');

const authSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true

    },
    title: {
        type: String,
    },
    firstName: {
        type: String,
    },

    lastName: {
        type: String,
    },
    companyName: {
        type: String,
    },
    streetAddress1: {
        type: String,
    },
    streetAddress2: {
        type: String,
    },
    town: {
        type: String,
    },
    county: {
        type: String,
    },
    country: {
        type: String,
        default: "United Kingdom"
    },
    postCode: {
        type: String,
    },
    workTel: {
        type: String,
    },

    mobileTel: {
        type: String,
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    isBlocked: {
        type: Boolean,
        required: true,
        default : false
    },

    role: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Role"
    }

});


module.exports = mongoose.model('Auth', authSchema);