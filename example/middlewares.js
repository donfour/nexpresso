function logID(req, res, next) {
  console.log('ID:', req.params.id);
  next();
}

function validateUser(req, res, next) {
  if (!req.body.name) {
    return res.status(400).send('User must have a name');
  }
  next();
}

module.exports = {
  logID,
  validateUser,
}