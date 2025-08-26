import { serverUrl } from "~/utils/serverUrl";
import type { Route } from "./+types/singlePost";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale/fr";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
//import { serverUrl } from "~/utils/serverUrl";
import Embed from "@editorjs/embed";
import { useEffect, useRef, useState } from "react";
import { redirect, useFetcher } from "react-router";
import toast, {Toaster} from "react-hot-toast"
import CommentList from "~/components/CommentList";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const { id } = params;

  try {
    const req = await fetch(serverUrl + `/posts/${id}`, {
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

export async function clientAction({request}:Route.ClientActionArgs){
  const formData = await request.formData()
  let token = localStorage.getItem("token")
  if(!token) return redirect("/login")
  
    try {
      const req = await fetch(serverUrl + "/comments/", {
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          Authorization: `Bearer ${token}`
        },
        body:JSON.stringify(Object.fromEntries(formData))
      })
      const response = await req.json()
      return response
      
    } catch (error) {
      return {error}
    }
}


export default function SinglePost({ loaderData }: Route.ComponentProps) {
  const post = loaderData;
  const editorRef = useRef<EditorJS | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const fetcher = useFetcher();

  useEffect(() => {
    const toastOptions = { duration: 5000 };
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: "editorContainer",
        tools: {
          header: Header,
          list: List,
          embed: {
            class: Embed,
            inlineToolbar: true,
          },
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: serverUrl + "/editor/uploadFile", // Your backend file uploader endpoint
                byUrl: serverUrl + "/editor/uploadUrl", // Your endpoint that provides uploading by Url
              },
            },
          },
        },
        data: JSON.parse(post.content),
        readOnly: true,

        onReady: () => {
          editorRef.current = editor;
          setIsEditorReady(true);
        },
      });
    }
    if (fetcher.data && fetcher.data.msg) {
      toast.success(fetcher.data.msg, toastOptions);
      //posthog.capture("post created")
    } else if (fetcher.data && fetcher.data.error) {
      toast.error(fetcher.data.error, toastOptions);
    }
    // Optional cleanup
    return () => {
      editorRef.current?.destroy?.();
      editorRef.current = null;
    };
  },[editorRef.current]);
  return (
    <div className="flex flex-col p-10 justify-center">
      <img
        src={serverUrl + "/" + post.cover}
        className="w-screen lg:hidden cover-fill lg:max-h-99"
      />
      <h1 className="text-3xl lg:text-center font-bold my-3 lg:text-6xl"> {post.title} </h1>
      <div className="mb-4 flex items-center gap-4 lg:justify-center">
        <p>
          {" "}
          <div className="avatar">
            <div className="size-8 rounded-full">
              <img src={serverUrl + "/" + post.author.avatar} alt="avatar" />
            </div>
          </div>{" "}
          {post.author.name}{" "}
        </p>
        <p>·</p>
        <p className="flex items-center">
          {formatDistance(new Date(post.updatedAt), new Date(), {
            addSuffix: true,
            locale: fr,
          })}{" "}
        </p>
      </div>
      <Toaster/>

      <div id="editorContainer"></div>
      <hr className="my-5" />
      <div className="flex flex-col gap-5">
        <CommentList postId={post._id}/>
      </div>
      <fetcher.Form method="post">
        <div className="sm:w-96">
          <label className="label-text" htmlFor="textareaLabel">
            {" "}
            Comment{" "}
          </label>
          <textarea
            className="textarea"
            placeholder="My comment!!!"
            required
            name="content"
            id="textareaLabel"
          ></textarea>
          <input type="hidden" name="postId" value={post._id} />
        </div>
        <button className="btn btn-primary">
        {" "}
            {fetcher.state === "idle" ? (
              "Send"
            ) : (
              <span className="loading loading-ball"></span>
            )}{" "}
        </button>
      </fetcher.Form>
    </div>
  );
}
