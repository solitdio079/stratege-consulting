import { Link, redirect, useFetcher, useNavigate } from "react-router"
import { serverUrl } from "~/utils/serverUrl"
import type { Route } from "./+types/createPost"
import { useUserStore } from "~/utils/stateStore";
import toast, {Toaster} from "react-hot-toast";
import {
    useReactTable,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
  } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

export async function clientLoader(){
    const token = localStorage.getItem("token")
    if(!token) return redirect("/login")

    try {
        const req = await fetch(serverUrl + "/posts/", {
            method: "GET",
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
// TData
type Post = {
    _id: string;
    title: string
    content: string 
    cover: string
    author: {
        avatar: string
        name: string,
        id:string
        role: string
    }
    category: string
  };
  

export default function AllPosts({loaderData}:Route.ComponentProps){
    const fetcher = useFetcher();
    const columnHelper = createColumnHelper<Post>();
    const user = useUserStore((state) => state.user);
    const [data, setData] = useState<Post[]>(loaderData);
    const navigate = useNavigate()

    const [globalFilter, setGlobalFilter] = useState<any>([]);

    const columns = useMemo(
        () => [
          columnHelper.accessor((row) => `${row.cover}`, {
            id: "cover",
            cell: (info) => {
              return (
                <img className="w-20" src={serverUrl + "/" + info.getValue()} />
              );
            },
          }),
          columnHelper.accessor((row) => `${row.title}`, {
            id: "title",
          }),
          columnHelper.accessor((row) => `${row.category}`, {
            id: "category",
          }),
          columnHelper.accessor((row) => `${row._id}`, {
            id: "edit",
            cell: ({ cell, row }) => {
              return (
                <Link to={`/admin/editPost/${row.original._id}`} className="btn btn-warning"> <span className="icon-[tabler--pencil] text-base-content size-6"></span></Link>
              );
            },
          }),
          columnHelper.accessor((row) => `${row._id}`, {
            id: "delete",
            cell: ({ cell, row }) => {
              return (
                <fetcher.Form method="post" action={`/admin/deletePost/${row.original._id}`}><button className="btn btn-error"> {fetcher.state === "idle" ? <span className="icon-[tabler--x] text-base-content size-6"></span> : <span className="loading loading-ball"></span>}</button> </fetcher.Form>
              );
            },
          }),
          
        ],
        []
      );
      const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
          pagination: {
            pageIndex: 0, //custom initial page index
            pageSize: 5, //custom default page size
          },
        },
        state: {
          globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
      });

      useEffect(() => {
        if (user.email !== "solitdio079@gmail.com") {
          navigate("/admin");
        }
        const toastOptions = { duration: 5000 };
    
        if (fetcher.data && fetcher.data.msg) {
            setData((prev) => prev.filter(item => item._id !== fetcher.data.oldPost._id))
            toast.dismiss()
            toast.success(fetcher.data.msg, toastOptions);
        } else if (fetcher.data && fetcher.data.error) {
          toast.error(fetcher.data.error, toastOptions);
        }
      }, [fetcher.data]);
    
    return (<>
     <div className="flex flex-col p-10 max-w-full overflow-x-auto">
      <div className="w-full flex gap-3 justify-between">
        <div>
          <input
            type="text"
            onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            placeholder="Search..."
            className="input max-w-60"
          />
        </div>
       
      </div>
      <div className="w-full overflow-x-auto">
        <Toaster />

        <table className="table">
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end gap-2">
        <button
        className="btn btn-info"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
         className="btn btn-info"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
         className="btn btn-info"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
         className="btn btn-info"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
      </div>
      </div>
    </>)
}