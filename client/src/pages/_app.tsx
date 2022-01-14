import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createClient, Provider } from "urql";
import NavBar from "../components/NavBar";

const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <NavBar />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
