import { redirect } from "react-router";
import type { Route } from "./+types/deleteComment";
import { serverUrl } from "~/utils/serverUrl";

export async function clientAction({params}:Route.ClientActionArgs){
    const {id} = params
    let token = localStorage.getItem("token")

    if(!token) return redirect("/login")
    
    try {
        const req = await fetch(serverUrl + `/comments/${id}`,{
            method: "DELETE",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        const response = await req.json()
        return response
        
    } catch (error) {
        return {error}
    }

}