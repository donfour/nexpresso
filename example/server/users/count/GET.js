const getCount = (req, res) => {
  return res.send('You have hit GET /users/count');
};

module.exports = { handler: getCount };
