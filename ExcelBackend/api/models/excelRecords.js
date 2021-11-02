const mongoose = require('mongoose');

const excelSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
  },

    file: {
        type: String,
        required: true
    },

    
    auth: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "Auth",
        unique : true
    }

});


module.exports = mongoose.model('ExcelRecord', excelSchema);