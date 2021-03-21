// import { useRouteData } from "@remix-run/react";

import styles from "url:../styles/index.css";

export let links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

// export let loader: LoaderFunction = () => {
//   return { message: "this is awesome 😎" };
// };

const Index = () => {
  // let data = useRouteData();

  return (
    <div>
      <h2>Welcome to Remix!</h2>
      <p>
        <a href="https://remix.run/dashboard/docs">Check out the docs</a> to get
        started.
      </p>
    </div>
  );
}

export default Index