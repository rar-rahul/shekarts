import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import { useEffect } from "react";
// import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Appearance from "~/components/Appearance";
import CheckAuth from "~/components/Auth/authCheck";
// import CookieContest from "~/components/cookieContest";
import GlobalLayout from "~/components/Layout/GlobalLayout";
import "~/public/css/bootstrap.min.css";
import { wrapper } from "~/redux/store";
import "~/styles/globals.css";
import { Roboto } from "next/font/google";
import { Inter } from "next/font/google";
import { appWithI18Next } from "ni18n";
import { ni18nConfig } from "../ni18n.config";

import { Great_Vibes } from "next/font/google";
import { Libre_Baskerville } from "next/font/google";

const greatVibes = Great_Vibes({
  weight: ["400"],  // Great Vibes usually has one weight
  subsets: ["latin"],  // or others as needed
  variable: "--font-great-vibes",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"], // Regular + Bold
  style: ["normal", "italic"],
  variable: "--font-libre-baskerville", // 👈 CSS variable
  display: "swap",
});


const roboto = Roboto({
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

import { Roboto_Mono } from "next/font/google";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // pick what you need
  variable: "--font-roboto-mono", // optional for CSS variables
});

const inter = Inter({
  subsets: ['latin'],
  style: 'normal',
  display: 'swap',
  variable: '--font-inter',
})

import { Lexend_Zetta } from "next/font/google";

const lexendZetta = Lexend_Zetta({
  subsets: ["latin"],
  weight: ["400", "700"], // choose weights you need
  variable: "--font-lexendZetta"
});

import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],   // required
  weight: ["400", "700"], // choose weights you need
  variable: "--font-cinzel"
});

import { Raleway } from "next/font/google";

const montserrat = Raleway({
  weight: ["500","600"],  // you pick what weights you need
  subsets: ["latin"],
  variable: "--font-heading",
});

import { Overpass } from "next/font/google";
const overpass = Overpass({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // choose what you need
  variable: "--font-overpass", // 👈 gives CSS variable
  display: "swap",
});

const NextNProgress = dynamic(() => import("nextjs-progressbar"), {
  ssr: false,
});

const Flip = dynamic(() =>
  import("react-toastify").then((module) => module.Flip)
);
const ToastContainer = dynamic(() =>
  import("react-toastify").then((module) => module.ToastContainer)
);

const ThirdPartyScript = dynamic(() => import("~/components/ThirdParty"));
const CookieContest = dynamic(() => import("~/components/cookieContest"));
const Appearance = dynamic(() => import("~/components/Appearance"));

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import("../public/js/jquery.min.js");
    import("../public/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <SessionProvider session={pageProps.session} refetchInterval={10 * 60}>
      <style jsx global>{`
        html,
        body {
          font-family: ${overpass.style.fontFamily};
        }
      `}</style>
      <div className={`${cinzel.variable} ${libreBaskerville.variable}`}>
      <ThirdPartyScript />
      <NextNProgress color="var(--primary)" options={{ showSpinner: false }} />
      <Appearance />
      <CookieContest />
      <CheckAuth
        auth={Component.requireAuth}
        authAdmin={Component.requireAuthAdmin}
      >
        <GlobalLayout
          dashboard={Component.dashboard}
          footer={Component.footer}
          error={Component.hasError}
        >
          <Component {...pageProps} />
        </GlobalLayout>
      </CheckAuth>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar
        newestOnTop={true}
        closeOnClick
        draggable
        pauseOnHover
        theme="colored"
        transition={Flip}
      />
      </div>
    </SessionProvider>
  );
}

export default wrapper.withRedux(appWithI18Next(MyApp, ni18nConfig));
