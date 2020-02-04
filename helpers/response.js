exports.success = (res, data, statusCode) => {
  return res.status(statusCode).json({
    status: true,
    data
  })
}

exports.error = (res, err, statusCode) => {
  return res.status(statusCode).json({
    status: false,
    errors: err
  })
}
