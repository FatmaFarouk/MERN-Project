const crypto = require('crypto');
const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/user.model');
const AppError = require('./../utils/AppError');
const sendEmail = require('./../utils/email');
const staff = require('../models/staff');

const catchAsync = fn => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
};

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY
    });
};

exports.signup = async(req, res)=>{
    try{
    // const newUser = await User.create(req.body);

    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role,
        passwordChangedAt: req.body.passwordChangedAt
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: "success",
        token,
        data: {
            newUser
        }
    })
}catch(err){
    res.status(400).json({
        status: "fail",
        massage: err
    })
}}


exports.login = catchAsync(async (req, res, next) => {
    const {_id, email, password } = req.body;
  
    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email });
  
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }
  

    // 3) If everything ok, send token to client
    // createSendToken(user, 200, res);
    const token =signToken(user._id);
    res.status(200).json({
        status: "success",
        token,
        userId: user._id,
        role: user.role
    })
});


// HERE I MAKE MIDDLE WARE FOR AUTHORIZATION (WILL BE CALLED AS PROTECT)
exports.protect = catchAsync(async (req, res, next) => {
    // getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
  
    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }
  
    //  verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);
    //check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401
        )
      );
    }
  
    // check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }
  
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});



// AUTHORIZATION MIDDLEWARE RESTRICTTO
exports.restrictTo = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
        return next(
          new AppError('You do not have permission to perform this action', 403)
        );
      }
  
      next();
    };
};
  
// CASE FORGETTING THE PASSWORD
exports.forgotPassword = catchAsync(async (req, res, next) => {
    // get user using email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('There is no user with email address.', 404));
    }
  
    // generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
  
    // send it to user's email
    // const resetURL = `${req.protocol}://${req.get(
    //   'host'
    // )}/api/v1/users/sresetPassword/${resetToken}`;
  
    const resetURL = `http://localhost:4200/reset-password?token=${resetToken}`;

    const message = `Forgot your password? Submit a update password request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message
      });
  
      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
  
      return next(
        new AppError('There was an error sending the email. Try again later!'),
        500
      );
    }
});
  

// START RESET THE PASSWORD
exports.resetPassword = catchAsync(async (req, res, next) => {
    // get user using the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
  
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
  
    // if token has not expired, and there is user, set the new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }

    if (req.body.password !== req.body.passwordConfirm) {
      return next(new AppError('Passwords do not match', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  
    // update changedPasswordAt property for the user
    // log the user in, send JWT
    // createSendToken(user, 200, res);
    const token =signToken(user._id);
    res.status(200).json({
        status: "success",
        token
    })
});
  




// update password
exports.updatePassword = catchAsync(async (req, res, next) => {
    // get user from collection
    const user = await User.findById(req.user.id).select('+password');
  
    // check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
      }
  
    //if so, update password
    user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
    // User.findByIdAndUpdate will NOT work as intended!
  
    // 4) Log user in, send JWT
    // createSendToken(user, 200, res);
    const token =signToken(user._id);
    res.status(200).json({
        status: "success",
        token
    })
});




// STAFF AREA //////////////////////////////////////////////////////////////////////////////////////////////////////////////////





exports.ssignup = async(req, res)=>{
  try{
  // const newUser = await User.create(req.body);


  // const branch = await Inventory.findById(req.body.branchId);
  //   if (!branch) {
  //     return res.status(400).json({
  //       status: 'fail',
  //       message: 'Invalid branchId. Please provide a valid branchId.'
  //     });
  //   }

  const newStaff = await staff.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      branchId: req.body.branchId,
      role: req.body.role,
      // passwordChangedAt: req.body.passwordChangedAt
  });

  const stoken = signToken(newStaff._id);

  res.status(201).json({
      status: "success",
      stoken,
      data: {
        newStaff
      }
  })
}catch(err){
  res.status(400).json({
      status: "fail",
      massage: err.message
  })
}}


exports.slogin = catchAsync(async (req, res, next) => {
  const {_id, email, password } = req.body;

  // const branch = await Inventory.findById(req.body.branchId);
  //   if (!branch) {
  //     return res.status(400).json({
  //       status: 'fail',
  //       message: 'Invalid branchId. Please provide a valid branchId.'
  //     });
  //   }

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const Staff = await staff.findOne({ email });

  if (!Staff || !(await Staff.correctPassword(password, Staff.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }


  // 3) If everything ok, send token to client
  // createSendToken(user, 200, res);
  const stoken =signToken(Staff._id);
  res.status(200).json({
      status: "success",
      stoken,
      StaffId: Staff._id,
      role: Staff.role
  })
});


// HERE I MAKE MIDDLE WARE FOR AUTHORIZATION (WILL BE CALLED AS PROTECT)
exports.sprotect = catchAsync(async (req, res, next) => {
  // getting token and check of it's there
  let stoken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    stoken = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    stoken = req.cookies.jwt;
  }

  if (!stoken) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  //  verification token
  const decoded = await promisify(jwt.verify)(stoken, process.env.JWT_SECRET);
  console.log(decoded);
  //check if user still exists
  const currentUser = await staff.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.staff = currentUser;
  res.locals.staff = currentUser;
  next();
});



// AUTHORIZATION MIDDLEWARE RESTRICTTO
exports.srestrictTo = (...roles) => {
  return (req, res, next) => {

      if (!roles.includes(req.staff.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

// CASE FORGETTING THE PASSWORD
exports.sforgotPassword = catchAsync(async (req, res, next) => {
  // get user using email
  const Staff = await staff.findOne({ email: req.body.email });
  if (!Staff) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // generate the random reset token
  const resetToken = Staff.createPasswordResetToken();
  await Staff.save({ validateBeforeSave: false });

  // send it to user's email
  // const resetURL = `${req.protocol}://${req.get(
  //   'host'
  // )}/api/v1/users/resetPassword/${resetToken}`;

  const resetURL = `http://localhost:4200/sreset-password?token=${resetToken}`;

  const message = `Forgot your password? Submit a update request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: Staff.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    Staff.passwordResetToken = undefined;
    Staff.passwordResetExpires = undefined;
    await Staff.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});


// START RESET THE PASSWORD
exports.sresetPassword = catchAsync(async (req, res, next) => {
  // get user using the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const Staff = await staff.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // if token has not expired, and there is user, set the new password
  if (!Staff) {
    return next(new AppError('Token is invalid or has expired', 400));
  }


  Staff.password = req.body.password;
  Staff.passwordResetToken = undefined;
  Staff.passwordResetExpires = undefined;
  await Staff.save();

  // update changedPasswordAt property for the user
  // log the user in, send JWT
  // createSendToken(user, 200, res);
  const stoken =signToken(Staff._id);
  res.status(200).json({
      status: "success",
      stoken
  })
});





// update password
exports.supdatePassword = catchAsync(async (req, res, next) => {
  // get user from collection
  const Staff = await staff.findById(req.staff.id).select('+password');

  // check if POSTed current password is correct
  if (!(await Staff.correctPassword(req.body.passwordCurrent, Staff.password))) {
      return next(new AppError('Your current password is wrong.', 401));
    }

  //if so, update password
  Staff.password = req.body.password;
await Staff.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  // createSendToken(user, 200, res);
  const stoken =signToken(Staff._id);
  res.status(200).json({
      status: "success",
      stoken
  })
});































// END OF STAFF EREA ///////////////////////////////////////////////////////////////////////////////////////////////





























































// const authService = require('../services/auth.service');


// async function registerUserController(req, res) {
//     try {
//         const { firstName, lastName, email, password, role } = req.body;
//         const { user, token } = await authService.registerUser(firstName, lastName, email, password, role);
//         res.status(201).json({ user, token });
//     } catch (error) {
//         console.error('Error in registerUserController:', error.message);
//         res.status(400).json({ message: error.message });
//     }
// }

// //log in
// async function loginUserController(req, res) {
//     try {
//         const { email, password } = req.body;
//         const { user, token } = await authService.loginUser(email, password);
//         res.status(200).json({ user, token });
//     } catch (error) {
//         console.error('Error in loginUserController:', error.message);
//         res.status(400).json({ message: error.message });
//     }
// }

// module.exports = {
//     registerUserController,
//     loginUserController
// };