const errorHandler = (err, req, res, next) => {
  // log exceptions to sentry or any
  res.status(500).json({ status: 500, error: `Someting failed, ${err.message}` });
};

export default errorHandler;
