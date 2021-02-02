const { Schema, model } = require("mongoose");

const PatientSchema = new Schema({
  userId:     { type: Schema.Types.ObjectId, ref: 'User' },
  doctorId:   { type: Schema.Types.ObjectId, ref: 'Doctor' },
  name:       { type: String},
  lastName:   { type: String},
  document:   { type: String},
  address:    { type: String},
  phone:      { type: String},
  gender:     { type: String},
  email:      { type: String},
  state:      { type: Boolean},
  deleted:    { type: Boolean, default: false},
  createdBy:  { type: Schema.Types.ObjectId, ref: 'User'},
  updatedBy:  { type: Schema.Types.ObjectId, ref: 'User'}
},{
  timestamps: true
},{
  collection: 'patients'
});

module.exports = model("Patient", PatientSchema);