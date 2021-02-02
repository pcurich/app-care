exports.generateUserMenu = function(req, res, next) {
  var menuItems = [{
          label: 'Home',
          href: '/'
      }, {
          label: 'My profile',
          href: '/user'
      }
  ]
  adjustMenuClass(menuItems, req._parsedUrl.pathname);
  res.locals.menuItems = menuItems;
  next();
};