var exports = module.exports = {};
const Rol = require("../models/Rol");


//Save cookie {startDate, lastRequestDate}
exports.onRequestStart = function(req, res, next) {
  var executions = req.app.get('executionsThisTime');
    req.app.set('executionsThisTime', ++executions);
    if (req.session.startDate) {
        req.session.lastRequestDate = Date.now();
    } else {
        req.session.startDate = Date.now();
        req.session.lastRequestDate = Date.now();
    }
    next();
}

exports.onRequestEnd = function(req, res, next) {
  function afterResponse() {
      var executions = req.app.get('executionsThisTime');
      res.removeListener('finish', afterResponse);
      res.removeListener('close', afterResponse);

      console.log('Executed ' + executions + ' times');
  }

  res.on('finish', afterResponse);
  res.on('close', afterResponse);

  next();
}

exports.generateMenu = async (req, res, next) => {
  var menuItems = [{
          label: 'Home',
          href: '/'
      }, {
          label: 'My profile',
          href: '/user'
      }
  ]
  const rol = await Rol.findById(req.user.rolId).lean()
  res.locals.menuItems = rol.acl;
  console.log("acl")
  console.log(rol.acl)
  next();
};


adjustMenuClass = (menuItems, pathname) => {
  for (var item in menuItems) {
      if (menuItems[item].href == pathname) {
          menuItems[item].class = 'menu-selected';
      }
      if (menuItems[item].menuItems) {
          adjustMenuClass(menuItems[item].menuItems, pathname)
      }
  }
}