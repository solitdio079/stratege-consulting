import { Outlet } from "react-router";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import ObserverProvider from "~/components/ObserverProvider";

export default function Layout() {
  return (
    <div data-theme="corporate">
      <ObserverProvider>
        <Navbar />
        <Outlet />
        <Footer />
      </ObserverProvider>
    </div>
  );
}
