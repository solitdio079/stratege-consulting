import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import InfiniteEntity from "~/components/InfiniteEntity";
import PostCard from "~/components/PostCard";
import { serverUrl } from "~/utils/serverUrl";
//import { Welcome } from "../welcome/welcome";
import myAvatar from "./my_avatar.jpg"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "buSolitdio New Website" },
    { name: "description", content: "Welcome to my new website!" },
  ];
}

export default function Home() {
  return (
    <div>
      <div className="flex flex-col intersect:motion-opacity-in-0 intersect:motion-translate-y-in-100 intersect:motion-blur-in-md lg:flex-row lg:gap-20  justify-center items-center bg-gray-100 rounded-2xl p-5 mx-5 lg:py-16 lg:px-24 my-10 lg:mx-40">
        <div className="border-2 border-gray-200 rounded-full p-16">
        <div className="avatar">
          <div className="size-44 rounded-full">
            <img
              src={myAvatar}
              alt="avatar"
            />
          </div>
        </div>
        </div>
       
        <div className="flex flex-col">
          <h1 className="text-2xl lg:text-6xl my-3">
            Hey, I'm <span className="font-bold">Djoko</span>
          </h1>
          <p>
            Breakfast procuring no end happiness allowance assurance frank. Met
            simplicity nor difficulty unreserved who. Entreaties mr conviction
            dissimilar me astonished estimating cultivated.
          </p>
          <ul className="menu menu-horizontal bg-transparent mx-0 px-0">
            <li>
              <a href="#" aria-label="Home Link">
                <span className="icon-[tabler--brand-github] size-6"></span>
              </a>
            </li>
            <li>
              <a href="#" aria-label="User Link">
                <span className="icon-[tabler--brand-youtube] size-6"></span>
              </a>
            </li>
            <li>
              <a href="#" aria-label="Message Link">
                <span className="icon-[tabler--brand-instagram] size-6"></span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <InfiniteEntity
        loaderRoute={"/postsLoader"}
        fetchMoreURL={serverUrl + "/posts/"}
        UnitEntity={PostCard}
      />
    </div>
  );
}
