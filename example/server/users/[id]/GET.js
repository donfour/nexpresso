const getIdFromParams = (req, res) => {
  return res.send(req.params.id);
};

module.exports = { handler: getIdFromParams };
