import { redirect } from "react-router";
import type { Route } from "./+types/deletePost";
import { serverUrl } from "~/utils/serverUrl";

export async function clientAction({params}:Route.ClientActionArgs){
    const {id} = params
    const token = localStorage.getItem("token")

    if(!token) return redirect("/login")

    try {
        const req = await fetch(serverUrl + `/posts/${id}`, {
            method:"DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        const response = await req.json()
        return response
        
    } catch (error) {
        return {error}
    }

}