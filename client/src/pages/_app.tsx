import type { AppProps } from "next/app";
import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    // just for the slider input :)
    <ChakraProvider>
      <div className="bg-background h-full sm:min-h-screen">
        <Component {...pageProps} />
      </div>
    </ChakraProvider>
  );
}
