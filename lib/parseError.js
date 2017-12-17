"use strict";

function splitMessage(message) {
  return message.split("::");
}

function parseError(errors) {
  const objectError = JSON.parse(JSON.stringify(errors));
  const messages = [];
  //   console.log(__("not_valid"));
  for (const key in objectError) {
    if (objectError.hasOwnProperty(key)) {
      const element = objectError[key];
      //   console.log(element.message);
      let splitMessage = element.message.split("::");
      messages.push(splitMessage);
    }
  }
  //   console.log(messages);
  for (const message of messages) {
    // console.log(message);
    switch (message[0]) {
      case "not_found":
        console.log(__(message[0]));
        break;
      case "not_valid":
        console.log(__(message[0]));
        break;
      case "number_min":
        console.log(
          __(message[0], {
            path: message[1],
            value: message[2],
            min: message[3]
          })
        );
        break;
      case "number_max":
        console.log(
          __(message[0], {
            path: message[1],
            value: message[2],
            min: message[3]
          })
        );
        break;
      case "required":
        console.log(__(message[0], { path: message[1] }));
        break;
      case "authenticate":
        console.log(__(message[0]));
        break;
      case "token":
        console.log(__(message[0]));
        break;
      case "mail":
        console.log(__(message[0], { value: message[1] }));
        break;
      default:
        console.log(__("generic", { error: message[0] }));
        break;
    }
  }
}

module.exports = parseError;
