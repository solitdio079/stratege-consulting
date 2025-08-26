import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import type { Route } from "../+types/root";
import CommentCard from "./CommentCard";
import { useUserStore } from "~/utils/stateStore";
import toast,{Toaster} from "react-hot-toast"

export default function CommentList({postId}:Route.ComponentProps){
    const fetcher = useFetcher()
    const [comments,setComments] = useState([])
    const user = useUserStore(state => state.user)
    useEffect(() => {
        const toastOptions = { duration: 5000 };
        if(!fetcher.data){
            fetcher.load(`/commentsLoader/${postId}`)
        }else{
            setComments(fetcher.data)
        }

        if (fetcher.data && fetcher.data.msg) {
            toast.success(fetcher.data.msg, toastOptions);
            //posthog.capture("post created")
          } else if (fetcher.data && fetcher.data.error) {
            toast.error(fetcher.data.error, toastOptions);
          }

    },[fetcher.data])

    return(<div className="flex flex-col gap-5 my-5">
        <Toaster/>
    <h1 className="text-2xl lg:text-3xl">Comments</h1>
    {comments.length>0 ? comments.map(item => <CommentCard item={item} disabled={user.fullName !== item.author.name} />) : ""}
    </div>)
}