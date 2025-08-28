import { Link, NavLink } from "react-router";
import { useUserStore } from "~/utils/stateStore";
import logo from "./logo.png";

export default function Navbar() {
  const user = useUserStore((state) => state.user);
  return (
    <>
      <nav className="navbar bg-base-100 max-sm:rounded-box max-sm:shadow-sm sm:border-b border-base-content/25 sm:z-1 relative">
        <div className="w-full md:flex md:items-center md:gap-2">
          <div className="flex items-center justify-between">
            <div className="navbar-start items-center justify-between max-md:w-full">
              <Link
                className="link text-base-content link-neutral text-xl font-bold no-underline"
                to="/"
              >
                <img src={logo} className="w-24 lg:w-72" />
              </Link>
              <div className="md:hidden">
                <button
                  type="button"
                  className="collapse-toggle rounded-none btn btn-outline btn-secondary btn-sm btn-square"
                  data-collapse="#navbar-collapse"
                  aria-controls="navbar-collapse"
                  aria-label="Toggle navigation"
                >
                  <span className="icon-[tabler--menu-2] collapse-open:hidden size-4"></span>
                  <span className="icon-[tabler--x] collapse-open:block hidden size-4"></span>
                </button>
              </div>
            </div>
          </div>
          <div
            id="navbar-collapse"
            className="md:navbar-end collapse hidden grow basis-full overflow-hidden transition-[height] duration-300 max-md:w-full"
          >
            <ul className="menu md:menu-horizontal gap-2 p-0 text-base max-md:mt-2">
            <li>
                {" "}
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "bg-primary link text-white font-bold" : "link"
                  }
                >
                  Accueil
                </NavLink>{" "}
              </li>
              <li>
                {" "}
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? "bg-primary link text-white font-bold" : "link"
                  }
                >
                  A propos
                </NavLink>{" "}
              </li>

              <li>
                {" "}
                <NavLink
                  to="/services"
                  className={({ isActive }) =>
                    isActive ? "bg-primary link text-white font-bold" : "link"
                  }
                >
                  Nos services
                </NavLink>{" "}
              </li>

              <li>
                {" "}
                <NavLink
                  to="/formations"
                  className={({ isActive }) =>
                    isActive ? "bg-primary link text-white font-bold" : "link"
                  }
                >
                  Formations & Evenements
                </NavLink>{" "}
              </li>

              <li>
                {" "}
                <NavLink
                  to="/blog"
                  className={({ isActive }) =>
                    isActive ? "bg-primary link text-white font-bold" : "link"
                  }
                >
                  Blog
                </NavLink>{" "}
              </li>
              <li>
                {" "}
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    isActive ? "bg-primary link text-white font-bold" : "link"
                  }
                >
                  Contact
                </NavLink>{" "}
              </li>

              {!user.fullName ? (
                <li>
                  <Link to="/login">Connectez-vous</Link>
                </li>
              ) : (
                <>
                  <li>
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "bg-primary link text-white font-bold" : "link"
                      }
                      to="/admin"
                    >
                      Compte
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "bg-primary link text-white font-bold" : "link"
                      }
                      to="/logout"
                    >
                      Deconnectez
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
