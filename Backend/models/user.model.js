const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const UserSchema = new mongoose.Schema({

    // _id: { type: String, required: true}, // we will do it easilly
    _id: { 
      type: mongoose.Schema.Types.ObjectId, auto: true
  },
    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },
    email: { type: String, required: true, unique: true, validate: [validator.isEmail, 'Invalid email'] },
    password: { type: String, required: true, minlenght: 8 }, // Hashed password
    passwordConfirm : { type: String, required: true, minlenght: 8,
      validate: {
        validator: function(el){
          return el === this.password;
        },
        message: "password are not the same!"
      }
     }, // Hashed password
    role: {
      type: String,
      enum: ['customer', 'seller', 'admin', 'manager','supplier'],
      required: true,
      default: 'customer'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    isEmailactive: {
      type: Boolean,
      default: true,
      select: false
    }
    // isAcrive:[0,1] //in case seller or delete also
    // isActive: { type: Boolean, default: true } /////////////////////////////take a look here
  },{ timestamps: true });

// middleware to hash the password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;

    next();
  } catch (error) {
    return next(error);
  }
});

// for update password
UserSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

UserSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
}}

UserSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('user', UserSchema);
module.exports = User;



// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const validator = require('validator');

// const UserSchema = new mongoose.Schema({

//     _id: { type: String, required: true}, // we will do it easilly

//     firstName: { type: String, required: [true, 'First name is required'] },
//     lastName: { type: String, required: [true, 'Last name is required'] },
//     email: { type: String, required: true, unique: true, validate: [validator.isEmail, 'Invalid email'] },
//     password: { type: String, required: true, minlenght: 8 }, // Hashed password
//     role: {
//       type: String,
//       enum: ['customer', 'seller', 'admin', 'manager', 'cashier', 'salesClerk', 'supplier'],
//       required: true,
//       default: 'customer'
//     },
//     // isAcrive:[0,1] //in case seller or delete also
//     isActive: { type: Boolean, default: true } /////////////////////////////take a look here
//   }
//   );


// // middleware to hash the password
// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();


//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(this.password, salt);

//     this.password = hashedPassword;
//     this.salt = salt;

//     next();
//   } catch (error) {
//     return next(error);
//   }
// });

// const User = mongoose.model('user', UserSchema);
// module.exports = User;