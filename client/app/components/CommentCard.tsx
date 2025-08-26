import { formatDistance } from "date-fns";
import { useFetcher } from "react-router";
import { serverUrl } from "~/utils/serverUrl";

export default function CommentCard({ item, disabled }) {
  const fetcher = useFetcher();
  return (
    <div className="flex flex-col shadow-md p-5 rounded-2xl">
      <div className="mb-4 flex items-center gap-4">
        <p>
          <div className="avatar">
            <div className="size-8 rounded-full">
              <img src={serverUrl + "/" + item.author.avatar} alt="avatar" />
            </div>
          </div>{" "}
          {item.author.name}{" "}
        </p>
        <p>·</p>
        <p className="flex items-center">
          {formatDistance(new Date(item.updatedAt), new Date(), {
            addSuffix: true,
          })}{" "}
        </p>
        {!disabled ?  <fetcher.Form method="post" action={`/deleteComment/${item._id}`}>
          <button className="btn btn-error btn-sm">
          {" "}
            {fetcher.state === "idle" ? (
               <span className="icon-[tabler--x] size-4"></span>
            ) : (
              <span className="loading loading-ball"></span>
            )}{" "}
            {" "}
           
          </button>
        </fetcher.Form>:""}
       
      </div>
      <div className="mx-5">{item.content}</div>
    </div>
  );
}
