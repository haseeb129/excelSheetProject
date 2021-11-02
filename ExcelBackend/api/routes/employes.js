const express = require('express');

const router = express.Router();

const employeController = require('../controllers/employes');
const middleware = require('../middleware/block');


router.get('/getAll/:id', middleware, employeController.getAll);
router.post('/addEmployee/:id', middleware, employeController.addEmployee);
router.delete('/removeEmployee/:id', middleware, employeController.removeEmployee);
router.get('/trueRandomSelection/:id', middleware, employeController.trueRandomSelection);
router.get('/sequentialRandomSelection/:id', middleware, employeController.sequentialRandomSelection);
router.get('/sequentialFlagReset/:id', middleware, employeController.sequentialFlagReset);


module.exports = router;