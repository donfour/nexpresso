const handler = (req, res) => {
  return res.send(req.params.id);
}

module.exports = { handler };