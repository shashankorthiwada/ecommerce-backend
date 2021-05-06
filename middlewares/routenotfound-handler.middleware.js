const routeNotFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "the route which you are looking for is not found",
  });
};

module.exports = { routeNotFound };
