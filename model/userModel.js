const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  mobile: {
    type: String,
    unique: true,
    trim: true,
  },
  photo: { type: String, default: "default.jpg" },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ["user", "author", "admin"],
    default: "user",
  },
  password: {
    type: String,
    select: false,
  },
  passwordChangedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // ! has the password with cost.
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPasswod
) {
  return await bcrypt.compare(candidatePassword, userPasswod);
};

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    // Remove unwanted fields
    delete ret.__v;
    delete ret.passwordChangedAt;
    delete ret.password;
    delete ret.active;

    // Optional: convert _id to id
    ret.id = ret._id;
    delete ret._id;

    return ret;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
