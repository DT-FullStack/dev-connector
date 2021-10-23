const AppError = require('./AppError');

const mongooseErrors = {
  ValidationError: (err) => {
    const messages = [];
    for (let name in err.errors) {
      messages.push(err.errors[name].properties.message);
    }
    return new AppError(`${messages.join('\n')}`, 400);
  }
}

module.exports = mongooseErrors;