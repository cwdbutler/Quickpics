import type { AppProps } from "next/app";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-background min-h-screen">
      <Component {...pageProps} />
    </div>
  );
}
