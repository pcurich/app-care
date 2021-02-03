const ctrl = {};

// Models
const Setting = require("../models/Setting");
const User = require("../models/User");
var ObjectId = require('mongodb').ObjectID;

//all-roles
ctrl.showSettings = async (req, res) => {
  const settings = await Setting.find().sort({ createdAt: "desc" }).lean();
  res.render('settings/all', {settings});
};

//GET new
ctrl.newSettingForm = async (req, res) => {
  res.render('settings/new' );
};

//POST new
ctrl.newSetting = async (req, res) => {
  const { nameSpace, name, key, value } = req.body;
  const errors = [];
  if (!name) {
    errors.push({ text: "Ingrese un nombre" });
  }
  if (!nameSpace) {
    errors.push({ text: "Ingrese un contexto" });
  }
  if (!key) {
    errors.push({ text: "Ingrese una clave" });
  }
  if (!value) {
    errors.push({ text: "Ingrese un valor" });
  }
  if (errors.length > 0) {
    res.render("settings/new", {errors, setting:req.body});
  }else{
    const newSetting = new Setting({ nameSpace, name, key, value });
    await newSetting.save();
    req.flash("success_msg", "Registro creado satisfactoriamente.");
    res.redirect("/settings");
  }
};

//GET edit
ctrl.updateSettingForm = async (req, res) => {
  const setting = await Setting.findById(req.params.id).lean();
  res.render('settings/edit', { setting });
};

//POST edit
ctrl.updateSetting = async (req, res) => {
  const { nameSpace, name, key, value } = req.body;
  const errors = [];
  if (!name) {
    errors.push({ text: "Ingrese un nombre" });
  }
  if (!nameSpace) {
    errors.push({ text: "Ingrese un contexto" });
  }
  if (!key) {
    errors.push({ text: "Ingrese una clave" });
  }
  if (!value) {
    errors.push({ text: "Ingrese un valor" });
  }
  if (errors.length > 0) {
    res.render("settings/edit", {errors, setting:req.body});
  }else{
    await Setting.findByIdAndUpdate(req.params.id, { nameSpace, name, key, value });
    req.flash("success_msg", "Registro actualizado satisfactoriamente.");
    res.redirect("/settings");
  }
};

ctrl.deleteSetting = async (req, res) => {
  await Setting.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Registro eliminado satisfactoriamente.");
  res.redirect('/settings');
};

module.exports = ctrl;