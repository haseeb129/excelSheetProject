const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/roles')

router.get('/getAll', rolesController.getAll);
router.post('/addRole', rolesController.insert);

module.exports = router;