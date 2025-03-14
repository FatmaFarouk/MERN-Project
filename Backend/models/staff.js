const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const validator = require('validator');


const StaffSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },
    email: { type: String, required: true, unique: true, validate: [validator.isEmail, 'Invalid email'] },
    password: { type: String, required: true, minlength: 8 },  // Hashed password
    branchId:{type: String  , ref:"Inventory" }, // does not it need to be required??????????????
    role: {
      type: String, 
      enum: ['cashier','clerk'],
      required: true,
    },
    isActive: { type: Boolean, default: true },
    passwordChangedAt: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date }
  }
  );

// handle isActive
StaffSchema.pre('save', function(next) {
   if (this.role === 'cashier') {
      this.isActive = true;
  } else if (this.role === 'clerk') {
      this.isActive = true;
  }
  next();
});


// middleware to hash the password
StaffSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);

    next();
  } catch (error) {
    return next(error);
  }
});

// for update password
StaffSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});


StaffSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


StaffSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
}}


StaffSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};



  const staff  = mongoose.model("staff", StaffSchema );
  module.exports = staff;


// const mongoose = require("mongoose");
// const { Schema, Types } = mongoose;

// const StaffSchema = new mongoose.Schema({
//     _id: { 
//       type: mongoose.Schema.Types.ObjectId, auto: true
//   },
//     firstName: { type: String, required: [true, 'First name is required'] },
//     lastName: { type: String, required: [true, 'Last name is required'] },
//     email: { type: String, required: true, unique: true, validate: [validator.isEmail, 'Invalid email'] },
//     password: { type: String, required: true, minlenght: 8 }, 
//     baranchId:{type: Types.ObjectId, ref:"Inventory" },
//     role: {
//       type: String,
//       enum: ['cashier','clerk'],
//       required: true,
//     },
//     isActive: { type: Boolean, default: true }
//   }
//   );

//   const staff  = mongoose.model("staff", StaffSchema );
//   module.exports = staff;