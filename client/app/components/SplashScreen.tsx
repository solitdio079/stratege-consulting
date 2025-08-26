//import logo from "../logo.png"

import { Link } from "react-router";

export default function SplashScreen(){
    return (
    <div className="flex w-full flex-col h-screen gap-3 justify-center items-center">
        <Link className="link text-base-content link-neutral text-xl font-bold no-underline" to="/">FlyonUI</Link>
        <span className="loading loading-ball"></span>

    </div>
    )
}