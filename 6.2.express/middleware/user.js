const User = require('../models/user');

module.exports = (req, res, next) => {
  const uid = req.session.uid;
  console.log('uid: ', uid);
  if (!uid) return next();
  User.get(uid, (err, user) => {
    req.user = res.locals.user = user;
    next();
  });
};
