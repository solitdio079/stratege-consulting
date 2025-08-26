import { useEffect, useRef, useState } from "react";
import { Link, redirect, useFetcher, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import { serverUrl } from "~/utils/serverUrl";
import Embed from "@editorjs/embed";
import toast, { Toaster } from "react-hot-toast";
import type { Route } from "../../+types/admin";
import categories from "~/utils/categories";

//import posthog from "posthog-js";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const token = localStorage.getItem("token");
  if (!token) return redirect("/login");
  try {
    const req = await fetch(serverUrl + "/posts/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const response = await req.json();
    return response;
  } catch (error) {
    return { error };
  }
}

type Inputs = {
  title: string;
  category: string;
};
export default function CreatePost() {
  const fetcher = useFetcher();
  const editorRef = useRef<EditorJS | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const {
    register,
    trigger,

    formState: { errors },
  } = useForm<Inputs>({});

  const [contentState, setContentState] = useState({});

  const [initial, setInitial] = useState(true);
  //trigger("firstName")
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
        placeholder: "Le contenu du post ICI!",

        onReady: () => {
          editorRef.current = editor;
          setIsEditorReady(true);
        },
      });
    }

    if (initial) {
      trigger();
      setInitial(false);
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
  });

  //console.log(errors);
  return (
    <>
      <fetcher.Form
        method="post"
        onSubmit={async (e) => {
          e.preventDefault();
          const toastOptions = { duration: 5000 };
          const data = await editorRef.current.save();
          if (data.blocks.length === 0) {
            toast.error("Contenu vide!", toastOptions);
          }
          // get the formData
          const formData = new FormData(e.target);
          formData.append("content", JSON.stringify(data));

          fetcher.submit(formData, {
            method: "POST",
            encType: "multipart/form-data",
          });
          e.target.reset();

          //console.log(data);
        }}
        encType="multipart/form-data"
        className="flex flex-col shadow-sm py-5 px-10 w-full"
      >
        <Toaster />
        <div>
          <h3 className="font-bold mb-5">Creer un post</h3>
          <div className="flex flex-col mb-5 lg:flex-row w-full gap-3 lg:gap-6">
            <div>
              <label
                className="label-text uppercase text-sm text-gray-600"
                htmlFor="firstName"
              >
                {" "}
                Titre*{" "}
              </label>
              <input
                type="text"
                {...register("title", { required: true })}
                name="title"
                required
                placeholder="John"
                className="input"
              />
              {errors.title ? (
                <p className="text-sm text-red-500"> {errors.title.message} </p>
              ) : (
                ""
              )}
            </div>
            <div className="max-w-sm">
              <label className="label-text" htmlFor="categorySelect">
                {" "}
                Pick a Category{" "}
              </label>
              <select
                className="select max-w-sm appearance-none"
                aria-label="select"
                name="category"
                id="categorySelect"
                defaultValue={"Post"}
              >
                {categories.length > 0
                  ? categories.map((category) => (
                      <option value={category.name}> {category.name} </option>
                    ))
                  : ""}
               
              </select>
              {errors.category ? (
                <p className="text-sm text-red-500">
                  {" "}
                  {errors.category.message}{" "}
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="max-w-sm">
              <label className="label-text" htmlFor="fileInputLabel">
                {" "}
                Pick a file{" "}
              </label>
              <input
                type="file"
                className="input"
                name="cover"
                required
                id="fileInputLabel"
              />
            </div>
          </div>
        </div>

        <div
          className="border mb-5 py-5 h-[60vh] overflow-scroll"
          id="editorContainer"
        ></div>
        <div className="flex justify-between">
          <button className="btn btn-primary">
            {" "}
            {fetcher.state === "idle" ? (
              "Creer"
            ) : (
              <span className="loading loading-ball"></span>
            )}{" "}
          </button>
        </div>
      </fetcher.Form>
    </>
  );
}
