const handlerErrors = (error, req, res, next) => {
  return res.status(500).json({
    error: "Internal Server Error",
    message: error.message,
  });
};

module.exports = handlerErrors;
