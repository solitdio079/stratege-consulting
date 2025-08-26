import { serverUrl } from "~/utils/serverUrl"
import type { Route } from "./+types/changeAvatar"

export async function clientAction({request}:Route.ClientActionArgs){
    const formData = await request.formData()
    const token = localStorage.getItem("token")
    try {
        const req = await fetch(serverUrl + "/users/avatar", {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })
        const response = await req.json()
        console.log(response)
        return response
    } catch (error) {
        return {error}
    }
}