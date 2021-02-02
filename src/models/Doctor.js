const { Schema, model } = require("mongoose");

const DoctorSchema = new Schema({
  name:       { type: String},
  lastName:   { type: String},
  address:    { type: String},
  phone:      { type: String},
  gender:     { type: String},
  birthday:   { type:Date},
  document:   { type: String},
  code:       { type: String},
  email:      { type: String},
  department: { type: String},
  userId:     { type: Schema.Types.ObjectId, ref: 'User' },
  state:      { type: Boolean},
  deleted:    { type: Boolean, default: false},
  createdBy:  { type: Schema.Types.ObjectId, ref: 'User'},
  updatedBy:  { type: Schema.Types.ObjectId, ref: 'User'}
},{
  timestamps: true
},{
  collection: 'doctors'
});

module.exports = model("Doctor", DoctorSchema);