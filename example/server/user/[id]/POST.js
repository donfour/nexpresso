const Joi = require('joi');

const request = {
  body: {
    schema: Joi.object({
      name: Joi.string().required(),
    }),
  }
}

const handler = (req, res) => {
  return res.send(req.body);
}

module.exports = {
  request,
  handler,
};