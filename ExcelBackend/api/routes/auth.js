const express = require ('express');

const router = express.Router();

const authController = require('../controllers/auth');
const middleware = require('../middleware/block');

router.get('/block/:id',authController.block);
router.get('/unblock/:id',authController.unblock);
router.get('/users',authController.getUsers);
router.get('/customers',authController.getCustomers);
router.post('/signupAdmin',authController.signupAdmin);
router.patch('/updatePassword/:id',middleware, authController.updatePassword);
router.post('/signup',authController.signup);
router.post('/activateaccount',authController.activate);
router.post('/login',authController.login);

module.exports = router;