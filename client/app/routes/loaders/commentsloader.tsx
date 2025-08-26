//import { redirect } from "react-router";
import { serverUrl } from "~/utils/serverUrl";
import type { Route } from "./+types/commentsloader";

export async function clientLoader({params}:Route.ClientLoaderArgs){
    const {postId} = params
    try {
      
        const req = await fetch(serverUrl + `/comments/${postId}`, {
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