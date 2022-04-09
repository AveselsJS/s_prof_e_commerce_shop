const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  surname_name: {
    type: String,
  },
  last_name: {
    type: String,
    required: [true, "Пожалуйста введите Вашу фамилию"],
  },
  email: {
    type: String,
    required: [true, "Пожалуйста введите Ваш email"],
    unique: true,
    lowercase: true,
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["user", "client", "manager", "moderator", "admin"],
  },
  password: {
    type: String,
    required: [true, "Пожалуйста введите Ваш пароль"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Пожалуйста повторите Ваш пароль"],
    minlength: 8,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 16);

  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
