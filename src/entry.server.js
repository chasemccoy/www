import React from 'react';
import ReactDOMServer from 'react-dom/server.js';
import Remix from '@remix-run/react/server.js';

export default function handleRequest(
	request,
	responseStatusCode,
	responseHeaders,
	remixContext
) {
	const markup = ReactDOMServer.renderToString(
		<Remix context={remixContext} url={request.url} />
	);

	if (process.env.NODE_ENV === 'development') {
		responseHeaders.set('cache-control', 'no-store');
	}

	return new Response('<!DOCTYPE html>' + markup, {
		status: responseStatusCode,
		headers: {
			...Object.fromEntries(responseHeaders),
			'Content-Type': 'text/html'
		}
	});
}
