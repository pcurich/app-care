const ctrl = {};

// Models
const Rol = require("../models/Rol");
const Setting = require("../models/Setting");
const Acl = require("../models/Acl");
var ObjectId = require('mongodb').ObjectID;

//all-roles
ctrl.showRols = async (req, res) => {
  const db = await Rol.find().lean();
  const roles = [];

  db.forEach(e=>{
    roles.push({ _id: e._id, name: e.name, state: e.state, acl: JSON.parse(e.acl) });
  });

  res.render('roles/all', {roles});
};

//GET new
ctrl.newRolForm = async (req, res) => {
  res.render('roles/new' );
};

//POST new
ctrl.newRol = async (req, res) => {
  const { name, state } = req.body;
  const errors = [];
  if (!name) {
    errors.push({ text: "Escriba un nombre para el rol" });
  }
  if (errors.length > 0) {
    res.render("roles/new", {errors,name});
  } else {    
    const newRol = new Rol({ name, createdBy: ObjectId(req.user.id), updatedBy: ObjectId(req.user.id) });
    if(state) {
      newRol.state = true;
    } else {
      newRol.state = false;
    }
    await newRol.save();

    const setting = await Setting.find({nameSpace:"ACL"}).lean();
    var aclNames = [];
    setting.forEach(e =>{
      const newAcl = new Acl({rolId: newRol._id, settingId: e._id, state:false});
      aclNames.push({name:e.name, state:false});
      newAcl.save();
    });

    await Rol.findByIdAndUpdate(newRol._id, { acl:JSON.stringify(aclNames) })

    req.flash("success_msg", "Rol creado satisfactoriamente, ingrese los accesos");
    res.redirect("/roles/edit/"+newRol._id);
  }
};

//GET edit
ctrl.updateRolForm = async (req, res) => {
  const acList = await Acl.find( { rolId:req.params.id } ).populate("settingId").lean();
  console.log(acList)
  const aclStr = acList.map( e =>{ return { name: e.settingId.name, state:e.state, _id:e._id }});
  const rol = await Rol.findByIdAndUpdate(req.params.id, {updatedBy: ObjectId(req.user.id), acl: JSON.stringify(aclStr)});
  if(rol.canDelete){
    res.render('roles/edit', { rol, listOfAcl:aclStr });
  }else{
    req.flash("error_msg", "No se puede actualizar este rol");
    res.redirect("/roles");
  }
};

//POST edit
ctrl.updateRol = async (req, res,next) => {
  const {name, state, acl} = req.body;
  const errors = [];

  if (!name) {
    errors.push({ text: "Escriba un nombre para el rol" });
  }

  if (errors.length > 0) {
    res.render("roles/new", {errors,name});
  }else{
    const dbAcl = await Acl.find( { rolId:req.params.id } ).lean();
    const dbRol = await Rol.findById( req.params.id ).lean();
    
    if (dbRol.canDelete){
      
      if(state) {
        await Rol.findByIdAndUpdate(req.params.id, { name, updatedBy: ObjectId(req.user.id), state: true });
      } else {
        await Rol.findByIdAndUpdate(req.params.id, { name, updatedBy: ObjectId(req.user.id), state: false });
      }
      
      dbAcl.forEach(async e => {
        await Acl.findByIdAndUpdate(e._id, {state:false})
      });
      
      if (Array.isArray(acl)){
        acl.forEach(async e=>{
          await Acl.findByIdAndUpdate(e, {state:true})
        });
      }else{
        await Acl.findByIdAndUpdate(acl, {state:true});
      }

      const acList = await Acl.find( { rolId:req.params.id } ).populate("settingId").lean();
      const aclStr = acList.map( e =>{ return { name: e.settingId.name, state:e.state, _id:e._id }});
      await Rol.findByIdAndUpdate(req.params.id, {updatedBy: ObjectId(req.user.id), acl: JSON.stringify(aclStr)});

      req.flash("success_msg", "Rol actualizado correctamente");
    }else{
      req.flash("error_msg", "No se puede actualizar el rol por ser el principal rol");
    }
  }
  res.redirect("/roles");
};

ctrl.deleteRol = async (req, res) => {
  const rol = await Rol.findById(req.params.id).lean();
  
  if (rol.canDelete){
    await Rol.findByIdAndDelete(rol._id);
    req.flash("success_msg", "Rol eliminado satisfactoriamente");
  }else{
    req.flash("error_msg", "No se puede eliminar este rol");
  }

  res.redirect('/roles');
};

module.exports = ctrl;