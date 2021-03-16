const { createRequestHandler } = require("./adapter");
exports.handler = createRequestHandler({ build: require("./build") });
