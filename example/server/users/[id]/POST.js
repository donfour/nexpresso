const { validateUser } = require('../../../middlewares');

const getBody = (req, res) => {
  return res.send(req.body);
};

module.exports = {
  handler: [validateUser, getBody],
};
