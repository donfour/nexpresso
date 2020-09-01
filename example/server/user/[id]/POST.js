const { logID, validateUser } = require('../../../middlewares');

const handler = (req, res) => {
  return res.send(req.body);
}

module.exports = {
  handler: [logID, validateUser, handler],
};