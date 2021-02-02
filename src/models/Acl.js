const { Schema, model } = require("mongoose");

const AclSchema = new Schema({
  rolId:      { type: Schema.Types.ObjectId, ref: 'Rol' },
  settingId:  { type: Schema.Types.ObjectId, ref: 'Setting' },
  state:      { type: Boolean}
});

module.exports = model("Acl", AclSchema);