class CustomError extends Error {
  constructor(name, ...params) {
    super(...params);
    this.name = name;
  }
}

module.exports = CustomError;
