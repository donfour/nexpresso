function validateUser(req, res, next) {
  if (!req.body.name) {
    return res.status(400).send('User must have a name');
  }
  next();
}

module.exports = {
  validateUser,
};
