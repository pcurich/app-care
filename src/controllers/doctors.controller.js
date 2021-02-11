const ctrl = {};

// Models
const Doctor = require("../models/Doctor");
const Setting = require("../models/Setting");
const User = require("../models/User");
const Rol = require("../models/Rol");
var ObjectId = require('mongodb').ObjectID;

//all-roles
ctrl.showDoctors = async (req, res) => {
  const user = await User.findById(req.user.id).populate("rolId").lean();
  if (user.rolId.canDelete){
    const doctors = await Doctor.find({deleted:false, userId: req.user.id}).lean();
    res.render('doctors/all', {doctors});
  }else{
    const doctors = await Doctor.find({deleted:false}).lean();
    res.render('doctors/all', {doctors});
  }
  
  
};

//GET new
ctrl.newDoctorForm = async (req, res) => {
  const genders = await Setting.find({nameSpace:"GENDER"}).lean();
  genders.unshift({key:'------', name:'------'});
  const departments = await Setting.find({nameSpace:"DEPARTMENT"}).lean();
  departments.unshift({key:'------', name:'------'});
  const rols = await Rol.find({ canDelete:true, state:true }).lean();
  rols.unshift({_id:'0', name:'------'});
  res.render('doctors/new',{ genders, departments,rols} );
};

//POST new
ctrl.newDoctor = async (req, res) => {
  const { name, lastName, birthday, document, code, department, gender, address, phone, password, email, rolId, state} = req.body;
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
  if (!code) {
    errors.push({ text: "Ingrese su número colegiatura" });
  }
  if (!email) {
    errors.push({ text: "Ingrese un correo" });
  }
  if (!password) {
    errors.push({ text: "Ingrese una contraseña" });
  }
  if (rolId=='0') {
    errors.push({ text: "Seleccione un rol" });
  }
  if (department == '------') {
    errors.push({ text: "Seleccione una especialidad" });
  }
  if (gender == '------') {
    errors.push({ text: "Seleccione un genero" });
  }
  if (errors.length > 0) {
    res.render("doctors/new", {errors, doctor:req.body});
  }else{
    const newDoctor = new Doctor({ name, lastName, birthday, document, code, department, gender, address, email, phone, createdBy: ObjectId(req.user.id), updatedBy: ObjectId(req.user.id) });
    if(state){
      newDoctor.state = true;
    }else{
      newDoctor.state = false;
    }
    
    const emailUser = await User.findOne({ email }).lean();
    if(!emailUser){
      
      const newUser = new User({ name, email, gender, rolId:ObjectId(rolId) });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();

      newDoctor.userId = ObjectId(newUser._id);
      await newDoctor.save();
      req.flash("success_msg", "Registro creado satisfactoriamente.");

    }else{
      var t = new User();
      var pwd = await t.encryptPassword(password);
      await User.findOneAndUpdate({ email }, { name, password:pwd, gender, rolId:ObjectId(rolId) });

      newDoctor.userId = ObjectId(emailUser._id);
      await newDoctor.save();
      
      req.flash("success_msg", "Registro creado satisfactoriamente. El usuario ya existia en el sistema");
    }
    res.redirect("/doctors");
  }
};

//GET edit
ctrl.updateDoctorForm = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate('userId').lean();
  const user = await User.findOne({email: doctor.email}).populate('rolId').lean();
  var d = new Date(doctor.birthday);
  d.setTime( d.getTime() + d.getTimezoneOffset()*60*1000 );
  doctor.birthday = d;
  const gendersDB = await Setting.find({nameSpace:"GENDER"}).lean();
  const genders= gendersDB.map(e=>{
    if (e.name == user.gender){
      return {key: e.name, name: e.name, selected:true}
    }else{
      return {key: e.name, name: e.name, selected:false}
    }
  })
  genders.unshift({key:'------', name:'------', selected:false});

  const departmentsDB = await Setting.find({nameSpace:"DEPARTMENT"}).lean();
  const departments= departmentsDB.map(e=>{
    if (e.name == doctor.department){
      return {key: e.name, name: e.name, selected:true}
    }else{
      return {key: e.name, name: e.name, selected:false}
    }
  });
  departments.unshift({key:'------', name:'------'});

  const rolsDB = await Rol.find({ canDelete:true, state:true}).lean();
  const rols= rolsDB.map(e=>{
    if (e.name == user.rolId.name){
      return {_id: e._id, name: e.name, selected:true}
    }else{
      return {_id: e._id, name: e.name, selected:false}
    }
  });
  rols.unshift({_id:'0', name:'------'});
  res.render('doctors/edit', { doctor, user, genders, departments,rols});
};

//PUT edit
ctrl.updateDoctor = async (req, res) => {
  const { name, lastName, birthday, document, code, department, gender, address, phone, password, email, rolId, userId, state} = req.body;
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
  if (!code) {
    errors.push({ text: "Ingrese su número colegiatura" });
  }
  if (!email) {
    errors.push({ text: "Ingrese un correo" });
  }
  if (!password) {
    errors.push({ text: "Ingrese una contraseña" });
  }
  if (rolId=='0') {
    errors.push({ text: "Seleccione un rol" });
  }
  if (department == '------') {
    errors.push({ text: "Seleccione una especialidad" });
  }
  if (gender == '------') {
    errors.push({ text: "Seleccione un genero" });
  }
  if (errors.length > 0) {
    res.render("doctors/edit", {errors, doctor:req.body});
  }else{
    if(state){
      await  Doctor.findByIdAndUpdate(req.params.id, { name, lastName, birthday: new Date(birthday), document, code, department, gender, address, email, phone,  updatedBy: ObjectId(req.user.id), state:true});
    }else{
      await  Doctor.findByIdAndUpdate(req.params.id, { name, lastName, birthday: new Date(birthday), document, code, department, gender, address, email, phone,  updatedBy: ObjectId(req.user.id), state:false});
    }
    const emailUser = await User.findById(userId);
    const tmp  = new User();
    const newPass = await tmp.encryptPassword(password);
    if(!emailUser){
      await User.findByIdAndUpdate(userId, {name, email, password: newPass, gender, rolId:ObjectId(rolId)});
      req.flash("success_msg", "Registro actualizado satisfactoriamente.");
    }else{
      await User.findByIdAndUpdate(userId, {name, password: newPass, gender, rolId:ObjectId(rolId)});
      req.flash("success_msg", "Registro actualizado satisfactoriamente. El usuario no se le cambio de correo debido a que el nuevo correo que ha ingresado ya esta registrado");
    }
    res.redirect("/doctors");
  }
  res.redirect("/doctors");
};

ctrl.deleteDoctor = async (req, res) => {
  await Doctor.findByIdAndDelete(req.params.id);
  res.redirect('/doctors');
};

module.exports = ctrl;