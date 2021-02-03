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
  if(req.user){
    const rol = await Rol.findById(req.user.rolId).lean()
    res.locals.menuItems = JSON.parse(rol.acl);
  }  
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

//https://handyman.dulare.com/session-management-in-express/
//https://handyman.dulare.com/handlebars-express-basics/
//https://handyman.dulare.com/multi-level-menu-in-express/
//https://handyman.dulare.com/passing-variables-through-express-middleware/
//https://github.com/pdulak/friendlyTracker
//https://expressjs.com/es/advanced/best-practice-security.html
//http://rocketseriesypeliculas.blogspot.com/2019/04/game-of-thrones.html