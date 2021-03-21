import { Meta, Links, Scripts, usePendingLocation } from "@remix-run/react";
import { Outlet } from "react-router-dom";
import Logo from './components/Logo';

import styles from "css:./styles/shared.css";

export let meta = () => {
  return {
    title: "Chase McCoy",
    description: "Chase McCoy is a product designer, front-end engineer, and internet explorer working on design systems at Stripe.",
    viewport: "width=device-width, initial-scale=1, shrink-to-fit=no"
  };
};

export let links = () => {
  return [
    { rel: "stylesheet", href: styles }
  ];
};

// export let loader = () => {
//   return { date: new Date() };
// };

export default function App() {
  // let data = useRouteData();
  const pendingLocation = usePendingLocation()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body className={pendingLocation ? 'opacity-50' : ''}>
        <div id='wrapper'>
          <div>
            <header>
              <Logo className='mb-16 mt-8' />
              {/* <Nav /> */}
            </header>

            <main>
              <Outlet />
              {/* <Footer /> */}
            </main>
          </div>
        </div>

        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Oops!</title>
      </head>
      <body>
        <div>
          <h1>App Error</h1>
          <pre>{error.message}</pre>
          <p>
            Replace this UI with what you want users to see when your app throws
            uncaught errors. The file is at <code>app/root.tsx</code>.
          </p>
        </div>

        <Scripts />
      </body>
    </html>
  );
}
