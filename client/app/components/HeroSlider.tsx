import { Outlet } from "react-router"
import type { Route } from "../+types/root"
//import heroBg from "./logo.png"

export default function HeroSlider({heroBg, children}:Route.ComponentProps){
    return(<>
     <div className="bg-base-100 ">
      <main className={`w-screen  bg-linear-to-r from-accent to-primary lg:h-[80vh] pb-10 lg:pb-0 relative `}>
      <img src={heroBg} className="absolute  blur-xs z-0 w-full h-full " alt="" />
        <div className="flex h-full flex-col  justify-between gap-18 overflow-x-hidden pt-20 md:gap-24 md:pt-25 lg:gap-15 lg:pt-27.5">
          <div className="mx-auto flex max-w-7xl flex-col justify-center items-center gap-8 justify-self-center px-4 text-center sm:px-6 lg:px-8">
            {children}
          </div>
        
        </div>
      </main>
    </div>
    </>)
}