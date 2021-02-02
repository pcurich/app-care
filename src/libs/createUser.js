const User = require("../models/User");
const Setting = require("../models/Setting");
const Rol = require("../models/Rol");
const Acl = require("../models/Acl");
var ObjectId = require('mongodb').ObjectID;


const createAdminUser = async () => {
  const userFound = await User.findOne({ email: "1@1.com" });

  if (userFound) return;

  const rolAdmnin = new Rol({name: 'Administrador', state:true, canDelete:false}); await rolAdmnin.save();
  const rolMedico = new Rol({name: 'Médico', state:false, canDelete:true}); await rolMedico.save();
  const rolPaciente = new Rol({name: 'Paciente', state:false, canDelete:true}); await rolPaciente.save();
  const rolEspecialista = new Rol({name: 'Especialista', state:false, canDelete:true}); await rolEspecialista.save();

  const gm = new Setting({nameSpace:"GENDER", key:"1", name:"Masculino", value:"Masculino" }); await gm.save();
  const gf = new Setting({nameSpace:"GENDER", key:"2", name:"Femenino", value:"Femenino" }); await gf.save();

  const s1 = new Setting({nameSpace:"ACL", key:"ACL-01", name:"Resgistrar Pacientes", value:"Resgistrar Pacientes" }); await s1.save();
  const a1 = new Acl({ rolId: ObjectId(rolAdmnin._id), settingId: ObjectId(s1._id), state: true}); await a1.save();

  const s2 = new Setting({nameSpace:"ACL", key:"ACL-02", name:"Resgistrar Médicos", value:"Resgistrar Médicos" }); await s2.save();
  const a2 = new Acl({ rolId: ObjectId(rolAdmnin._id), settingId: ObjectId(s2._id), state: true}); await a2.save();

  const s3 = new Setting({nameSpace:"ACL", key:"ACL-03", name:"Resgistrar Especialista", value:"Resgistrar Especialista" }); await s3.save();
  const a3 = new Acl({ rolId: ObjectId(rolAdmnin._id), settingId: ObjectId(s3._id), state: true}); await a3.save();

  const s4 = new Setting({nameSpace:"ACL", key:"ACL-04", name:"Resgistrar Pacientes", value:"Resgistrar Pacientes" }); await s4.save();
  const a4 = new Acl({ rolId: ObjectId(rolAdmnin._id), settingId: ObjectId(s4._id), state: true}); await a4.save();

  const s5 = new Setting({nameSpace:"ACL", key:"ACL-05", name:"Resgistrar Pacientes", value:"Resgistrar Pacientes" }); await s5.save();
  const a5 = new Acl({ rolId: ObjectId(rolAdmnin._id), settingId: ObjectId(s5._id), state: true}); await a5.save();

  const d1 = new Setting({nameSpace:"DEPARTMENT", key:"", name:"Anestesiología", value:"Anestesiología" }); await d1.save();
  const d2 = new Setting({nameSpace:"DEPARTMENT", key:"", name:"Otorrinolaringología", value:"Otorrinolaringología" }); await d2.save();
  const d3 = new Setting({nameSpace:"DEPARTMENT", key:"", name:"Endocrinología", value:"Endocrinología" }); await d3.save();
  const d4 = new Setting({nameSpace:"DEPARTMENT", key:"", name:"Traumatología", value:"Traumatología" }); await d4.save();
  const d5 = new Setting({nameSpace:"DEPARTMENT", key:"", name:"Neurología", value:"Neurología" }); await d5.save();
  const d6 = new Setting({nameSpace:"DEPARTMENT", key:"", name:"Gineco-obstetricia", value:"Gineco-obstetricia" }); await d6.save();
  const d7 = new Setting({nameSpace:"DEPARTMENT", key:"", name:"Cirugía General", value:"Cirugía General" }); await d7.save();
  const d8 = new Setting({nameSpace:"DEPARTMENT", key:"", name:"Dermatología", value:"Dermatología" }); await d8.save();
  const d9 = new Setting({nameSpace:"DEPARTMENT", key:"", name:"Cardiología", value:"Cardiología" }); await d9.save();
  const d10 = new Setting({nameSpace:"DEPARTMENT", key:"", name:"Pediatría", value:"Pediatría" }); await d10.save();

  const acl = await Setting.find({nameSpace:"ACL"}).lean();
  await Rol.findByIdAndUpdate(rolAdmnin._id,{ acl: JSON.stringify(acl.map( e =>{ return {name: e.name, state:true, _id:e._id }}))});
  await Rol.findByIdAndUpdate(rolMedico._id,{ acl: JSON.stringify(acl.map( e =>{ return {name: e.name, state:false, _id:e._id }}))});
  await Rol.findByIdAndUpdate(rolPaciente._id,{ acl: JSON.stringify(acl.map( e =>{ return {name: e.name, state:false, _id:e._id }}))});
  await Rol.findByIdAndUpdate(rolEspecialista._id,{ acl: JSON.stringify(acl.map( e =>{ return {name: e.name, state:false, _id:e._id }}))});
  
  acl.forEach(e =>{
    const newAcl = new Acl({rolId: rolAdmnin._id, settingId: e._id, state:false}); newAcl.save();
  });
  acl.forEach(e =>{
    const newAcl = new Acl({rolId: rolMedico._id, settingId: e._id, state:false}); newAcl.save();
  });
  acl.forEach(e =>{
    const newAcl = new Acl({rolId: rolPaciente._id, settingId: e._id, state:false}); newAcl.save();
  });
  acl.forEach(e =>{
    const newAcl = new Acl({rolId: rolEspecialista._id, settingId: e._id, state:false}); newAcl.save();
  });

  const newUser = new User({ name: 'Pedro Curich', email: "1@1.com", rolId: ObjectId(rolAdmnin._id)});
  newUser.password = await newUser.encryptPassword("123");
  const admin = await newUser.save();

  console.log("Administrador creado satisfactoriamente", admin);
};

module.exports = { createAdminUser };