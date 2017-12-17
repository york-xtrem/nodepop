"use strict";

class ValidatorError extends Error {
  constructor(errors, status) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.message = parseError(errors);

    this.status = status || 400;
  }
}

function parseError(errors) {
  const objectError = JSON.parse(JSON.stringify(errors));
  const messages = [];
  for (const key in objectError) {
    if (objectError.hasOwnProperty(key)) {
      const element = objectError[key];
      let splitMessage = element.message.split("::");
      messages.push(splitMessage);
    }
  }
  const translatedErrors = [];
  let translatedError;
  for (const message of messages) {
    switch (message[0]) {
      case "not_valid":
        translatedError = __(message[0]);
        console.log(translatedError);
        translatedErrors.push(translatedError);
        break;
      case "number_min":
        translatedError = __(message[0], {
          path: __(message[1]),
          value: message[2],
          min: message[3]
        });
        console.log(translatedError);
        translatedErrors.push(translatedError);
        break;
      case "number_max":
        translatedError = __(message[0], {
          path: __(message[1]),
          value: message[2],
          min: message[3]
        });
        console.log(translatedError);
        translatedErrors.push(translatedError);
        break;
      case "required":
        translatedError = __(message[0], { path: __(message[1]) });
        console.log(translatedError);
        translatedErrors.push(translatedError);
        break;
      case "mail":
        translatedError = __(message[0], { value: message[1] });
        console.log(translatedError);
        translatedErrors.push(translatedError);
        break;
      case "tags":
        translatedError = __(message[0], { value: message[1] });
        console.log(translatedError);
        translatedErrors.push(translatedError);
        break;
      case "unique":
        translatedError = __(message[0], {
          path: __(message[1]),
          value: __(message[2])
        });
        console.log(translatedError);
        translatedErrors.push(translatedError);
        break;
      default:
        translatedError = __("generic", { error: message[0] });
        console.log(translatedError);
        translatedErrors.push(translatedError);
        break;
    }
  }
  return translatedErrors;
}

module.exports = ValidatorError;
