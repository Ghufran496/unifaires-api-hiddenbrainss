/**
 * Slantapp code and properties {www.slantapp.io}
 */
class CoreError extends Error {
  constructor(msg, code) {
    super(msg);
    this.statusCode = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

exports.CoreError = CoreError;
//json parser function
exports.JParser = (m, s, d) => ({ message: m, status: s, data: d });

//ascii code generator
exports.AsciiCodes = function generateChar(length) {
  //populate and store ascii codes
  let charArray = [];
  let code = [];
  for (let i = 33; i <= 126; i++) charArray.push(String.fromCharCode(i));
  //do range random here
  for (let i = 0; i <= length; i++) {
    code.push(charArray[Math.floor(Math.random() * charArray.length - 1)]);
  }
  return code.join("");
};

exports.shuffleArray = function (array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

exports.validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((errorItem) => errorItem.message);

      return res.status(400).json({
        message: "validation error",
        status: false,
        data: errors,
      });
    }
    next();
  };
};

exports.validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((errorItem) => errorItem.message);

      return res.status(400).json({
        message: "validation error",
        status: false,
        data: errors,
      });
    }
    next();
  };
};

exports.validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((errorItem) => errorItem.message);

      return res.status(400).json({
        message: "validation error",
        status: false,
        data: errors,
      });
    }
    next();
  };
};
