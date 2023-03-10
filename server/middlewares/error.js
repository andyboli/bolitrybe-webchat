function errorBoom(err, res) {
  const {
    output: {
      payload: { statusCode, message },
    },
    data,
  } = err;

  const response = res.status(statusCode);

  if (data) {
    return response.json({ error: { message, ...data } });
  }

  return response.json({ error: { message, details: null } });
}

function errorMiddleware() {
  return (err, _req, res, _next) => {
    if (err.isBoom) {
      return errorBoom(err, res);
    }

    return res.status(500).json({ error: { message: err.message, details: null } });
  };
}

module.exports = errorMiddleware;
