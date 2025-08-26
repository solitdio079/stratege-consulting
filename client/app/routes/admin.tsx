import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useUserStore } from "~/utils/stateStore";

export default function Admin() {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.fullName) navigate("/login");
  });
  return (
    <div className="flex flex-col lg:flex-row">
      <button
        type="button"
        className="btn btn-text max-sm:btn-square sm:hidden"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="default-sidebar"
        data-overlay="#with-navbar-sidebar"
      >
        <span className="icon-[tabler--menu-2] size-5"></span>
      </button>

      <aside
        id="with-navbar-sidebar"
        className="overlay [--auto-close:sm] sm:shadow-none overlay-open:translate-x-0 drawer drawer-start hidden max-w-64 sm:z-0 sm:flex sm:translate-x-0 pt-16"
        role="dialog"
        tabIndex={-1}
      >
        <div className="drawer-body px-2 pt-4">
          <ul className="menu p-0">
            <li>
              <a href="#">
                <span className="icon-[tabler--home] size-5"></span>
                Home
              </a>
            </li>
            <li>
              <NavLink to="editUser">
                <span className="icon-[tabler--user] size-5"></span>
                Profile
              </NavLink>
            </li>
            <li>
              <a href="#">
                <span className="icon-[tabler--message] size-5"></span>
                Notifications
              </a>
            </li>

            <li className="space-y-0.5">
              <a
                className="collapse-toggle collapse-open:bg-base-content/10"
                id="menu-app"
                data-collapse="#menu-app-collapse"
              >
                <span className="icon-[tabler--books] size-5"></span>
                Posts
                <span className="icon-[tabler--chevron-down] collapse-open:rotate-180 size-4 transition-all duration-300"></span>
              </a>
              <ul
                id="menu-app-collapse"
                className="collapse hidden w-auto space-y-0.5 overflow-hidden transition-[height] duration-300"
                aria-labelledby="menu-app"
              >
                <li>
                  <NavLink to="createPost">
                    <span className="icon-[tabler--plus] size-5"></span>
                    Create
                  </NavLink>
                </li>
                <li>
                  <NavLink to="allPosts">
                    <span className="icon-[tabler--calendar] size-5"></span>
                    All
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
              <a href="#">
                <span className="icon-[tabler--login] size-5"></span>
                Sign In
              </a>
            </li>
            <li>
              <a href="#">
                <span className="icon-[tabler--logout-2] size-5"></span>
                Sign Out
              </a>
            </li>
          </ul>
        </div>
      </aside>
      <div className="w-full lg:ml-64 ">
        <Outlet />
      </div>
    </div>
  );
}
