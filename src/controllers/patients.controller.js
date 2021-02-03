const ctrl = {};

// Models
var Patient = require("../models/Patient");
var Doctor = require("../models/Doctor");
var Setting = require("../models/Setting");
var ObjectId = require('mongodb').ObjectID;

//all-patients
ctrl.showPatients = async (req, res) => {
  const doctor = await Doctor.findOne({ userId: (req.params.userId)}).lean();
  const patients = await Patient.find({ userId: (req.params.userId)}).lean();
  res.render('patients/all', { doctor, patients });
};

//GET new-patient
ctrl.newPatientForm = async (req, res) => {
  const doctor = await Doctor.findOne({ userId: (req.params.userId)}).lean();
  const genders = await Setting.find({nameSpace:"GENDER"}).lean();
  genders.unshift({key:'------', name:'------'});
  res.render('patients/new',{ doctor, genders } );
};

//POST new-patient
ctrl.newPatient = async (req, res) => {
  const { name, lastName, document, gender, address, phone,  email, state} = req.body;
  const errors = [];
  if (!name) {
    errors.push({ text: "Ingrese un nombre" });
  }
  if (!lastName) {
    errors.push({ text: "Ingrese los apellidos" });
  }
  if (!document) {
    errors.push({ text: "Ingrese su número de DNI" });
  }
  if (!email) {
    errors.push({ text: "Ingrese un correo" });
  }
  if (gender == '------') {
    errors.push({ text: "Seleccione un genero" });
  }
  if (errors.length > 0) {
    res.render("patients/new/"+req.params.userId, {errors, patient:req.body});
  }else{
    const doctor = await Doctor.findOne({userId: ObjectId(req.params.userId)}).lean()
    if(doctor){
      const newPatient = new Patient({doctorId: ObjectId(doctor._id), userId: ObjectId(doctor.userId), name, lastName, document, gender, address, email, phone, createdBy: ObjectId(req.user.id), updatedBy: ObjectId(req.user.id) });
      if(state){
        newPatient.state = true;
      }else{
        newPatient.state = false;
      }
      await newPatient.save();
      req.flash("success_msg", "Registro creado satisfactoriamente.");
    }else{
      req.flash("error_msg", "No se ha identificado a un doctor al que se va a vincular el paciente.");
    }
  }
  res.redirect("/patients/"+req.params.userId);
};

//GET edit-patient
ctrl.updatePatientForm = async (req, res) => {
  const patient = await Patient.findById(req.params.id).lean();
  const gendersDB = await Setting.find({nameSpace:"GENDER"}).lean();
  const genders= gendersDB.map(e=>{
    if (e.name == patient.gender){
      return {key: e.name, name: e.name, selected:true}
    }else{
      return {key: e.name, name: e.name, selected:false}
    }
  })
  genders.unshift({key:'------', name:'------', selected:false});
  res.render('patients/edit', { patient, genders});
};

//POST edit-patient
ctrl.updatePatient = async (req, res) => {
  const { name, lastName, document, gender, address, phone,  email, state} = req.body;
  const errors = [];
  if (!name) {
    errors.push({ text: "Ingrese un nombre" });
  }
  if (!lastName) {
    errors.push({ text: "Ingrese los apellidos" });
  }
  if (!document) {
    errors.push({ text: "Ingrese su número de DNI" });
  }
  if (!email) {
    errors.push({ text: "Ingrese un correo" });
  }
  if (gender == '------') {
    errors.push({ text: "Seleccione un genero" });
  }
  if (errors.length > 0) {
    const patient = await Patient.findById(req.params.id).lean();
    const gendersDB = await Setting.find({nameSpace:"GENDER"}).lean();
    const genders= gendersDB.map(e=>{
      if (e.name == patient.gender){
        return {key: e.name, name: e.name, selected:true}
      }else{
        return {key: e.name, name: e.name, selected:false}
      }
    })
  genders.unshift({key:'------', name:'------', selected:false});
    res.render("patients/edit", { errors, genders, patient:req.body });
  }else{
    if(state){
      await  Patient.findByIdAndUpdate(req.params.id, { name, lastName, document, gender, address, email, phone,  updatedBy: ObjectId(req.user.id), state:true});
    }else{
      await  Patient.findByIdAndUpdate(req.params.id, { name, lastName, document, gender, address, email, phone,  updatedBy: ObjectId(req.user.id), state:false});
    }
    req.flash("success_msg", "Registro actualizado satisfactoriamente.");
    const patient = await Patient.findById(req.params.id);
    res.redirect("/patients/"+patient.userId);
  } 
};

//delete
ctrl.deletePatient = async (req, res) => {
  const patient = await Patient.findById(req.params.id)
  await Patient.findByIdAndDelete(req.params.id);
  res.redirect('/patients/'+patient.userId);
};

module.exports = ctrl;