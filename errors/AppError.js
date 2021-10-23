/**
 * @description Custom error class to include status on creation
 */
class AppError extends Error {
  constructor(message, status = 500) {
    super();
    this.message = message;
    this.status = status;
  }
}

module.exports = AppError;