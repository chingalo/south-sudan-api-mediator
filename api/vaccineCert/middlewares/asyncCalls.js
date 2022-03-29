const asyncMiddleware = (hander) => async (req, res, next) => {
  try {
    await hander(req, res);
  } catch (error) {
    next(error);
  }
};

export default asyncMiddleware;
