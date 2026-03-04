// util/wrapAsync.js
module.exports = function (fn) {
  return function (req, res, next) {
    // if fn() returns a promise, catch any errors and pass them to next()
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};