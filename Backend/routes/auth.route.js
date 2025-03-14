const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// aaaaaaaaaaaaaaaaaa
router.post('/signup',authController.signup);
router.post('/login',authController.login);

router.post('/forgetPassword',authController.forgotPassword);
router.patch('/resetPassword/:token',authController.resetPassword);
// update the password
// router.patch('/updataMyPassword', authController.protect,authController.restrictTo('manager') ,authController.updatePassword);

router.post('/ssignup',authController.ssignup);
router.post('/slogin',authController.slogin);

router.post('/sforgetPassword',authController.sforgotPassword);
router.patch('/sresetPassword/:token',authController.sresetPassword);


module.exports = router;


// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');

// router.post('/register', authController.registerUserController);
// router.post('/login', authController.loginUserController);

// module.exports = router;

