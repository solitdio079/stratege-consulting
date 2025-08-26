//import { redirect } from "react-router";
import { serverUrl } from "~/utils/serverUrl";

export async function clientLoader(){
    try {
      
        const req = await fetch(serverUrl + "/posts/?cursor=&limit=5", {
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