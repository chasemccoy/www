const core = require('@remix-run/core');

const fetch = (input, init) =>
	core.fetch(input, {
		compress: false,
		...init
	});

global.Headers = core.Headers;
global.Request = core.Request;
global.Response = core.Response;
global.fetch = fetch;
