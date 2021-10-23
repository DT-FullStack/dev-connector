/**
 * @description catches errors for async route handlers in express
 * @param {Function} fn 
 * @returns a route handling function for express
 */

const asyncErrorCatch = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(e => next(e));
  }
}

module.exports = asyncErrorCatch;