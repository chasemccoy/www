var core = require("@remix-run/core");

let fetch = (input, init) =>
  core.fetch(input, {
    compress: false,
    ...init,
  });

global.Headers = core.Headers;
global.Request = core.Request;
global.Response = core.Response;
global.fetch = fetch;
