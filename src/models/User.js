const { Schema, model } = require("mongoose");

const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  name:     { type: String },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender:   { type: String },
  rolId:    { type: Schema.Types.ObjectId, ref: 'Rol'},
  state:    { type: Boolean, default: true },
  date:     { type: Date, default: Date.now },
},{
  timestamps: true
},{
  collection: 'users'
});

UserSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = model("User", UserSchema);