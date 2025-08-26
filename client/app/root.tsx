import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { useEffect } from 'react';
import SplashScreen from "./components/SplashScreen";
//import { useLocation } from 'react-router-dom';

async function loadFlyonUI() {
  return import('flyonui/flyonui');
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const initFlyonUI = async () => {
      try {
        // Dynamically import FlyonUI JS
        const flyon = await import('flyonui/flyonui');

        // Wait briefly if needed (optional)
        setTimeout(() => {
          if (
            window.HSStaticMethods &&
            typeof window.HSStaticMethods.autoInit === 'function'
          ) {
            window.HSStaticMethods.autoInit();
          }
        }, 100);
      } catch (err) {
        console.error('FlyonUI failed to load:', err);
      }
    };

    initFlyonUI();
   /*posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
      api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
      capture_pageview: false,
      debug: import.meta.env.MODE === "development",
    });*/
  }, [location.pathname]); // Runs on route change + initial mount

  return <div data-theme="light"> <Outlet /></div>;
}
export function HydrateFallback() {
  return <SplashScreen />;
}


export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
