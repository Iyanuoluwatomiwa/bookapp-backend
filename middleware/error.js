const error = (err, req, res, next) => {
  // console.log("got here from error handler", error);
    console.log("Simple Error", err.message);
    console.log("Stack trace", err.stack);

  return res.status(500).json({
    error: "Internal Server Error. please check the log for details",
  });
};

module.exports = error;
