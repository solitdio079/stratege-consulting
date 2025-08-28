import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import InfiniteEntity from "~/components/InfiniteEntity";
import PostCard from "~/components/PostCard";
import { serverUrl } from "~/utils/serverUrl";
//import { Welcome } from "../welcome/welcome";
import myAvatar from "./my_avatar.jpg"

import SwiperComponent from "~/components/Swiper";
import HomeServices from "~/components/HomeServices";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "buSolitdio New Website" },
    { name: "description", content: "Welcome to my new website!" },
  ];
}

export default function Home() {
  return (
    <div>
      <SwiperComponent/>
      <HomeServices/>
      <InfiniteEntity
        loaderRoute={"/postsLoader"}
        fetchMoreURL={serverUrl + "/posts/"}
        UnitEntity={PostCard}
      />
    </div>
  );
}
