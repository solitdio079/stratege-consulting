import { Link } from "react-router";
import { useUserStore } from "~/utils/stateStore";

export default function Navbar(){
  const user = useUserStore(state => state.user)
    return (<>
    <nav  className="navbar bg-base-100 max-sm:rounded-box max-sm:shadow-sm sm:border-b border-base-content/25 sm:z-1 relative">
  <div className="w-full md:flex md:items-center md:gap-2">
    <div className="flex items-center justify-between">
      <div className="navbar-start items-center justify-between max-md:w-full">
        <Link className="link text-base-content link-neutral text-xl font-bold no-underline" to="/">FlyonUI</Link>
        <div className="md:hidden">
          <button type="button" className="collapse-toggle btn btn-outline btn-secondary btn-sm btn-square" data-collapse="#navbar-collapse" aria-controls="navbar-collapse" aria-label="Toggle navigation" >
            <span className="icon-[tabler--menu-2] collapse-open:hidden size-4"></span>
            <span className="icon-[tabler--x] collapse-open:block hidden size-4"></span>
          </button>
        </div>
      </div>
    </div>
    <div id="navbar-collapse" className="md:navbar-end collapse hidden grow basis-full overflow-hidden transition-[height] duration-300 max-md:w-full" >
      <ul className="menu md:menu-horizontal gap-2 p-0 text-base max-md:mt-2">
        {!user.fullName ?  <li><Link to="/login">Connectez-vous</Link></li> : <>
          <li><Link to="/admin">Compte</Link></li>
          <li><Link to="/logout">Deconnectez</Link></li>
        </>}
      
        <li><a href="#">Link 2</a></li>
        <li className="dropdown relative inline-flex [--auto-close:inside] [--offset:8] [--placement:bottom-end]">
          <button id="dropdown-link" type="button" className="dropdown-toggle dropdown-open:bg-base-content/10 dropdown-open:text-base-content" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown" >
            Parent
            <span className="icon-[tabler--chevron-down] dropdown-open:rotate-180 size-4"></span>
          </button>
          <ul className="dropdown-menu dropdown-open:opacity-100 hidden" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-link" >
            <li><a className="dropdown-item" href="#">Link 3</a></li>
            <li><a className="dropdown-item" href="#">Link 4</a></li>
            <li><a className="dropdown-item" href="#">Link 5</a></li>
            <hr className="border-base-content/25 -mx-2" />
            <li><a className="dropdown-item" href="#">Link 6</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
    </>)
}