const AppError = require('./AppError');

const mongoErrors = {
  MongoServerError: (err) => {
    const messages = [];
    const { message } = err;
    console.dir(err);
    if (message.includes('duplicate key error')) {
      for (let key in err.keyValue) {
        messages.push(`${key[0].toUpperCase()}${key.slice(1)} ${err.keyValue[key]} is already in use`)
      }
    }
    return new AppError(messages.join('\n'), 400);
  }
}

module.exports = mongoErrors;