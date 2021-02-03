const ctrl = {};

const User = require("../models/User");

ctrl.renderIndex = async (req, res) => {
  if(req.user)
  {
    const user = await User.findById(req.user.id).populate('rolId').lean();
    user.rolId.acl = JSON.parse(user.rolId.acl);
    res.render('index',{currentUser:user});
  }else{
    res.redirect("/users/signin");
  }
};

ctrl.renderAbout = (req, res) => {
  res.render('about');
};

module.exports = ctrl;