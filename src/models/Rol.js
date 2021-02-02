const { Schema, model } = require("mongoose");

const RolSchema = new Schema({
  name:     { type: String },
  acl:      { type: String },
  state:    { type: Boolean },
  createdBy:{ type: Schema.Types.ObjectId, ref: 'User'},
  updatedBy:{ type: Schema.Types.ObjectId, ref: 'User'},
  canDelete:{ type: Boolean, default:true }
},{
  timestamps: true
},{
  collection: 'rols'
});

module.exports = model("Rol", RolSchema);