import { type RouteConfig, index,layout,route } from "@react-router/dev/routes";

export default [layout("./routes/layout.tsx", [
    index("./routes/home.tsx"),
    route("verify","./routes/verify.tsx"),
    route("category/:category", "./routes/category.tsx"),
    route("singlePost/:id", "./routes/singlePost.tsx"),
    route("admin","./routes/admin.tsx", [
        route("createPost", "./routes/admin/Posts/createPost.tsx"),
        route("allPosts", "./routes/admin/Posts/allPosts.tsx"),
        route("editPost/:id", "./routes/admin/Posts/editPost.tsx"),
        route("deletePost/:id", "./routes/admin/Posts/deletePost.tsx"),
        route("editUser", "./routes/admin/Users/editUser.tsx"),
    ]),
    route("logout", "./routes/logout.tsx"),
    // Loaders 
    route("postsLoader", "./routes/loaders/posts.tsx"),
    route("categoryPosts/:category", "./routes/loaders/categoryPosts.tsx"),
    route("commentsLoader/:postId", "./routes/loaders/commentsloader.tsx"),
    // Actions
    route("deleteComment/:id","./routes/actions/deleteComment.tsx"),
    route("changeAvatar", "./routes/admin/Users/changeAvatar.tsx")
]),
route("signup", "./routes/signup.tsx"),
route("login", "./routes/login.tsx")
] satisfies RouteConfig;
