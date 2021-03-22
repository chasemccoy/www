import ReactDOMServer from "react-dom/server";
import Remix from "@remix-run/react/server";

export default function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  let markup = ReactDOMServer.renderToString(
    <Remix context={remixContext} url={request.url} />
  );

  if (process.env.NODE_ENV === 'development') {
    responseHeaders.set('cache-control', 'no-store')
  }

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: {
      ...Object.fromEntries(responseHeaders),
      "Content-Type": "text/html",
    },
  });
}
