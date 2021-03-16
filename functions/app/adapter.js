var url = require("url");
var core = require("@remix-run/core");
require("./fetchGlobals");

function createRequestHandler({
  build,
  getLoadContext,
  mode = process.env.NODE_ENV,
}) {
  let handleRequest = core.createRequestHandler(build, mode);
  return async (event, context) => {
    let request = createRemixRequest(event);
    let loadContext =
      typeof getLoadContext === "function"
        ? getLoadContext(event, context)
        : undefined;
    let response = await handleRequest(request, loadContext);
    let body = await response.text();
    return {
      statusCode: response.status,
      // TODO: use this for multiple set-cookie
      // multiValueHeaders: getMultiValueHeaders(response.headers),
      headers: Object.fromEntries(response.headers),
      body: body || undefined,
    };
  };
}

function createRemixRequest(event) {
  let host = event.headers["x-forwarded-host"] || event.headers.host;
  let rawPath = getRawPath(event);
  let url$1 = new url.URL(rawPath, `https://${host}`);
  let init = { method: event.httpMethod, headers: event.headers };

  if (event.httpMethod !== "GET" && event.httpMethod !== "HEAD") {
    init.body = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString()
      : event.body;
  }
  return new core.Request(url$1.toString(), init);
}

// TODO: Figure why netlify urls lose information?
function getRawPath(event) {
  let searchParams = new URLSearchParams();
  let paramKeys = Object.keys(event.multiValueQueryStringParameters);
  for (let key of paramKeys) {
    let values = event.multiValueQueryStringParameters[key];
    for (let val of values) {
      searchParams.append(key, val);
    }
  }
  let rawParams = searchParams.toString();

  let rawPath = event.path;
  if (rawParams) rawPath += `?${rawParams}`;

  return rawPath;
}

exports.createRequestHandler = createRequestHandler;
