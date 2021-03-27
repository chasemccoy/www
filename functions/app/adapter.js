const url = require('url');
const core = require('@remix-run/core');
require('./fetchGlobals');

function createRequestHandler({
	build,
	getLoadContext,
	mode = process.env.NODE_ENV
}) {
	const handleRequest = core.createRequestHandler(build, mode);
	return async (event, context) => {
		const request = createRemixRequest(event);
		const loadContext =
			typeof getLoadContext === 'function'
				? getLoadContext(event, context)
				: undefined;
		const response = await handleRequest(request, loadContext);
		const body = await response.text();
		return {
			statusCode: response.status,
			// TODO: use this for multiple set-cookie
			// multiValueHeaders: getMultiValueHeaders(response.headers),
			headers: Object.fromEntries(response.headers),
			body: body || undefined
		};
	};
}

function createRemixRequest(event) {
	const host = event.headers['x-forwarded-host'] || event.headers.host;
	const rawPath = getRawPath(event);
	const url$1 = new url.URL(rawPath, `https://${host}`);
	const init = {method: event.httpMethod, headers: event.headers};

	if (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') {
		init.body = event.isBase64Encoded
			? Buffer.from(event.body, 'base64').toString()
			: event.body;
	}

	return new core.Request(url$1.toString(), init);
}

// TODO: Figure why netlify urls lose information?
function getRawPath(event) {
	const searchParameters = new URLSearchParams();
	const parameterKeys = Object.keys(event.multiValueQueryStringParameters);
	for (const key of parameterKeys) {
		const values = event.multiValueQueryStringParameters[key];
		for (const value of values) {
			searchParameters.append(key, value);
		}
	}

	const rawParameters = searchParameters.toString();

	let rawPath = event.path;
	if (rawParameters) {
		rawPath += `?${rawParameters}`;
	}

	return rawPath;
}

exports.createRequestHandler = createRequestHandler;
