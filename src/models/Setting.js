const { Schema, model } = require("mongoose");

const SettingSchema = new Schema({
  nameSpace: { type: String },
  name:      { type: String },
  key:       { type: String },
  value:     { type: String }
},{
  timestamps: true
},{
  collection: 'settings'
});

module.exports = model("Setting", SettingSchema);