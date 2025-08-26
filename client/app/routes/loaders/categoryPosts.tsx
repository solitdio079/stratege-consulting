//import { redirect } from "react-router";
import { serverUrl } from "~/utils/serverUrl";
import type { Route } from "./+types/categoryPosts";

export async function clientLoader({params}:Route.ClientLoaderArgs){
    const {category} = params
    try {
      
        const req = await fetch(serverUrl + `/posts/?cursor=&limit=5&category=${category}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await req.json();
        return response;
      } catch (error) {
        return { error };
      }
}