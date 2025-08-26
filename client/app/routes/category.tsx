import { useParams } from "react-router";
import InfiniteEntity from "~/components/InfiniteEntity";
import PostCard from "~/components/PostCard";
import { serverUrl } from "~/utils/serverUrl";

export default function Category() {
  const { category } = useParams();
  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:gap-20  justify-center items-center bg-gray-100 rounded-2xl p-5 mx-5 lg:py-16 lg:px-24 my-10 lg:mx-40">
        <div className="flex flex-col">
          <h1 className="text-2xl lg:text-6xl my-3 font-bold">
            {category}
          </h1>
        </div>
      </div>
      <InfiniteEntity
        loaderRoute={`/categoryPosts/${category}`}
        fetchMoreURL={serverUrl + `/posts/?category=${category}`}
        UnitEntity={PostCard}
      />
    </div>
  );
}
