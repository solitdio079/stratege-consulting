import { serverUrl } from "~/utils/serverUrl";
import { useUserStore } from "~/utils/stateStore";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { redirect, useFetcher } from "react-router";
import type { Route } from "./+types/editUser";
import toast, { Toaster } from "react-hot-toast";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const token = localStorage.getItem("token");
  if (!token) return redirect("/login");
  const formData = await request.formData();
  const bodyObject = Object.fromEntries(formData);

  try {
    const req = await fetch(serverUrl + `/users/${bodyObject.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyObject),
    });
    const response = await req.json();
    if (response.error) {
      console.log(response);
    }
    return response;
  } catch (error) {
    return { error };
  }
}

type Inputs = {
  fullName: string;
  email: string;
};
export default function EditUser() {
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const fetcher = useFetcher();
  const {
    register,
    trigger,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      fullName: user.fullName || "",
      email: user.email || "",
    },
  });

  const [initial, setInitial] = useState(true);
  //trigger("university")
  useEffect(() => {
    const toastOptions = { duration: 5000 };
    if (initial) {
      trigger();
      setInitial(false);
    }

    if (fetcher.data && !fetcher.data.error) {
        toast.dismiss()
      toast.success("User updated!", toastOptions);
      console.log(fetcher.data);
      updateUser(fetcher.data);
    } else if (fetcher.data && fetcher.data.error) {
      toast.error(fetcher.data.error, toastOptions);
    }
  });

  return (
    <div className="flex flex-col  m-10">
      <div className="flex flex-col lg:flex-row">
        <div className="flex flex-col items-center gap-2 max-sm:flex-wrap">
          <div className="avatar">
            <div className="size-40 rounded-full">
              <img src={serverUrl + "/" + user.avatar} alt="avatar" />
            </div>
          </div>
          <fetcher.Form
            method="post"
            encType="multipart/form-data"
            action="/changeAvatar"
          >
            <input
              type="file"
              name="avatar"
              onChange={(e) => {
                e.stopPropagation();
                fetcher.submit(e.target.form);
                e.target.form?.reset();
              }}
              className="file:text-bg-primary file:px-4 file:h-9.5 cursor-pointer file:font-medium file:text-base block text-sm file:me-3 file:rounded-full file:uppercase"
              aria-label="file-input"
            />
          </fetcher.Form>
        </div>
        <div className="flex flex-col gap-2">
          <fetcher.Form method="post" action="">
            <input type="hidden" name="id" value={user._id} />
            <div className="flex flex-wrap gap-4">
              <div className="w-96">
                <label className="label-text" htmlFor="fullName">
                  Nom complet*
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  {...register("fullName", {
                    minLength: { value: 4, message: "Minimum 4 characteres" },
                    required: "Ce champ est obligatoire.",
                  })}
                  onInput={() => trigger("fullName")}
                  className={
                    errors.fullName
                      ? "input border-red-500  max-w-sm"
                      : "input border-green-500  max-w-sm"
                  }
                  name="fullName"
                  id="fullName"
                />
                {errors.fullName ? (
                  <p className="text-sm text-red-500">
                    {" "}
                    {errors.fullName.message}{" "}
                  </p>
                ) : (
                  ""
                )}
              </div>
              <Toaster />
              <div className="w-96">
                <label className="label-text" htmlFor="email">
                  email*
                </label>
                <input
                  type="email"
                  {...register("email", {
                    minLength: { value: 4, message: "Minimum 4 characteres" },
                    required: "Ce champ est obligatoire.",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Email invalid",
                    },
                  })}
                  onInput={() => trigger("email")}
                  placeholder="abc123@example.com"
                  className={
                    errors.email
                      ? "input border-red-500  max-w-sm"
                      : "input border-green-500  max-w-sm"
                  }
                  name="email"
                  id="email"
                />
                {errors.email ? (
                  <p className="text-sm text-red-500">
                    {" "}
                    {errors.email.message}{" "}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <button className="btn btn-primary my-5">
              {" "}
              {fetcher.state === "idle" ? (
                "Changer"
              ) : (
                <span className="loading loading-ball"></span>
              )}{" "}
            </button>
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
}
