import type { AppProps } from "next/app";
import "../styles/globals.css";
import NavBar from "../components/NavBar";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NavBar pageProps={pageProps} />
      <Component {...pageProps} />
    </>
  );
}
