/* eslint-disable no-console */
// Makes sure the tests fails when a PropType validation fails.
function consoleError() {
  console.error = (...args) => {
    console.info(...args);
    throw new Error(...args);
  };
}

module.exports = consoleError;
