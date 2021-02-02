const ctrl = {};

const Setting = require("../models/Setting");
const User = require('../models/User');
const Rol = require("../models/Rol");
const passport = require("passport");
var ObjectId = require('mongodb').ObjectID


//GET users
ctrl.showUsers = async (req, res) => {
  const users = await User.find().populate('rolId').lean();
  res.render('users/all',{users});
};

//GET new
ctrl.newUserForm = async (req, res) => {
  const rols = await Rol.find({ canDelete:true, state:true }).lean();
  rols.unshift({_id:'0', name:'------'});
  const genders = await Setting.find({nameSpace:"GENDER"}).lean();
  genders.unshift({key:'------', name:'------'});
  res.render('users/new',{ rols, genders } );
} 

//POST new
ctrl.newUser = async (req, res) => {
  const { name, email, password, gender, rolId } = req.body;
  console.log(req.body)
  let errors = [];  
  if (password.length < 4) {
    errors.push({ text: "La contraseña debe tener almenos 4 caracteres." });
  }
  if (gender == '------' ) {
    errors.push({ text: "Seleccione un género" });
  }
  if (rolId == '0') {
    errors.push({ text: "Seleccione un rol" });
  }
  if (!email) {
    errors.push({ text: "Ingrese un correo" });
  }
  if (errors.length > 0) {
    const genders = await Setting.find({nameSpace:"GENDER"}).lean();
    genders.unshift({key:'------', name:'------'});

    const rols = await Rol.find({canDelete:true}).lean();
    rols.unshift({_id:'0', name:'------'});
    
    res.render("users/edit", { errors, newUser: req.body, genders, rols });
  } else {
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
      req.flash("error_msg", "El correo esta en uso.");
      res.redirect("/users/edit/"+ req.params.id);
    } else {

      const newUser = new User({ name, email, password, gender, rolId:ObjectId(rolId) });
      newUser.password = await newUser.encryptPassword(password);

      if(state){
        newUser.state = true;
      }else{
        newUser.state = false;
      }

      await newUser.save();

      req.flash("success_msg", "Usuario actualizado.");
      res.redirect("/users");
    }
  }
} 

//GET edit
ctrl.updateUserForm = async (req, res) => {
  const newUser = await User.findById( req.params.id).populate('rolId').lean();

  const gendersDB = await Setting.find({nameSpace:"GENDER"}).lean();
  const genders= gendersDB.map(e=>{
    if (e.name == newUser.gender){
      return {key: e.name, name: e.name, selected:true}
    }else{
      return {key: e.name, name: e.name, selected:false}
    }
  })
  genders.unshift({key:'------', name:'------', selected:false});

  const rolsDB = await Rol.find({ canDelete:true, state:true}).lean();
  const rols= rolsDB.map(e=>{
    if (e.name == newUser.rolId.name){
      return {_id: e._id, name: e.name, selected:true}
    }else{
      return {_id: e._id, name: e.name, selected:false}
    }
  });
  rols.unshift({_id:'0', name:'------'});
  res.render('users/edit', { newUser, rols, genders });
};

//PUT edit
ctrl.updateUser = async (req, res) => {
  const { name, email, password, gender, rolId, state } = req.body;
  let errors = [];  
  if (password.length < 4) {
    errors.push({ text: "La contraseña debe tener almenos 4 caracteres." });
  }
  if (gender == '------' ) {
    errors.push({ text: "Seleccione un género" });
  }
  if (rolId == '0') {
    errors.push({ text: "Seleccione un rol" });
  }
  if (!email) {
    errors.push({ text: "Ingrese un correo" });
  }
  if (errors.length > 0) {
    const genders = await Setting.find({nameSpace:"GENDER"}).lean();
    genders.unshift({key:'------', name:'------'});

    const rols = await Rol.find({canDelete:true}).lean();
    rols.unshift({_id:'0', name:'------'});
    
    res.render("users/edit", { errors, newUser: req.body, genders, rols });
  } else {
    const user = await User.findById(req.params.id).populate("rolId").lean()
    if(user.rolId.canDelete){
      const emailUser = await User.findOne({ email: email , _id: { $ne: req.params.id } });
      if (emailUser) {
        req.flash("error_msg", "El correo esta en uso.");
        res.redirect("/users/edit/"+ req.params.id);
      } else {
        var t = new User()
        const pass = await t.encryptPassword(password);
        console.log(pass)
        if (state){
          await User.findByIdAndUpdate( req.params.id, { name, email, password: pass, gender, rolId:ObjectId(rolId), state:true });
        }else{
          await User.findByIdAndUpdate( req.params.id, { name, email, password: pass, gender, rolId:ObjectId(rolId), state:false });
        }
        req.flash("success_msg", "Usuario actualizado.");
        res.redirect("/users");
      }
    }else{
      req.flash("error_msg", "Este usuario no se puede actualizar por tener un rol particular.");
      res.redirect("/users");
    }
  }
}

//DELETE
ctrl.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id).populate("rolId").lean()
  if(user.rolId.canDelete){
    await User.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Usuario eliminado satisfactoriamente");
  }else{
    req.flash("error_msg", "El usuario no se puede eliminar por tene run rol especial");
  }
  
  res.redirect('/users');
};

//GET /users/signup
ctrl.signUpForm = async (req, res) => {
  const genders = await Setting.find({nameSpace:"GENDER"}).lean();
  genders.unshift({key:'------', name:'------'});
  const rols = await Rol.find({canDelete:true}).lean();
  rols.unshift({_id:'0', name:'------'});
  res.render('users/signup', { genders, rols });
};

//POST /users/signup
ctrl.singUp = async (req, res) => {
  const { name, email, password, confirm_password, gender, rolId } = req.body;
  console.log(req.body)
  let errors = [];  
  if (password != confirm_password) {
    errors.push({ text: "No coincide la contraseña" });
  }
  if (password.length < 4) {
    errors.push({ text: "La contraseña debe tener almenos 4 caracteres." });
  }
  if (gender == '0' ) {
    errors.push({ text: "Seleccione un género" });
  }
  if (rolId == '------') {
    errors.push({ text: "Seleccione un rol" });
  }
  if (errors.length > 0) {
    const genders = await Setting.find({nameSpace:"GENDER"}).lean();
    genders.unshift({key:'------', name:'------'});
    const rols = await Rol.find({canDelete:true}).lean();
    rols.unshift({_id:'0', name:'------'});
    res.render("users/signup", { errors, user: req.body, rols });
  } else {
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
      req.flash("error_msg", "El correo esta en uso.");
      res.redirect("/users/signup");
    } else {
      const newUser = new User({ name, email, password, gender, rolId:ObjectId(rolId) });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash("success_msg", "Usuario registrado.");
      res.redirect("/users/signup");
    }
  }
};

ctrl.signInForm = (req, res) => {
  res.render("users/signin");
};

ctrl.signin = passport.authenticate("local", {
    successRedirect: "/customers",
    failureRedirect: "/users/signin",
    failureFlash: true,
    successFlash: 'Bienvenido'
  });

ctrl.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out now.");
  res.redirect("/users/signin");
};

module.exports = ctrl;