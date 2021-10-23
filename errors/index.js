const express = require('express');
const router = express.Router();

const AppError = require('./AppError');
router.all('*', (req, res, next) => {
  next(new AppError('Page not found', 404));
})

const handler = (errorMap) => {
  return (err, req, res, next) => {
    const handler = errorMap[err.name];
    if (handler) err = handler(err);
    next(err);
  }
}

const errorMaps = [
  require('./mongooseErrors'),
  require('./mongoErrors')
];

module.exports = {
  notFound: router,
  errorHandlers: errorMaps.map(fn => handler(fn))
};