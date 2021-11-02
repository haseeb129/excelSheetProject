const multer = require('multer');
const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const middleware = require('../middleware/block');
const excelController = require('../controllers/excelRecords');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files/')
    },
    filename: function (req, file, cb) {
        // cb(null, new Date().toISOString()+file.originalname)
        cb(null, new mongoose.Types.ObjectId() + file.originalname)

    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype === 'application/vnd.ms-excel') {
        console.log('if')
        cb(null, true);
    }
    else {
        console.log('else')
        cb(null, false);
    }
}

const upload = multer({
    storage: storage
    , limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter
});

// router.post('/uploadFile',excelController.insert);

router.post('/uploadFile',middleware,upload.single('file'),excelController.insert);
router.get('/downloadFile/:id',excelController.get);
router.patch('/update/:id',middleware,upload.single('file'),excelController.update);



module.exports = router;



