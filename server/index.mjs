import express from "express"
import "dotenv/config.js"
import mongoose from "mongoose"
import cors from "cors"
import userRouter from "./routes/users.mjs"
import notificationRouter from "./routes/notifications.mjs"
import commentRouter from "./routes/comments.mjs"
import authRouter from "./routes/auth.mjs"
import postRouter from "./routes/posts.mjs"
import editorRouter from "./routes/editor.mjs"

main().catch(err => console.log(err));

const corsOptions = {
    origin: [
        'http://localhost:5173',
    ],
}
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Database connected!');
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


const port  = process.env.PORT || 5000
const app = express()
app.use(cors(corsOptions))
app.use(express.static('public'))

app.use("/users",userRouter)
app.use("/auth",authRouter)
app.use("/notifications",notificationRouter)
app.use("/posts",postRouter)
app.use("/comments",commentRouter)
app.use("/editor", editorRouter)

app.get("/", (req,res) => {
    return res.send("Welcome to the home page!")
})
app.listen(port, () => {
    console.log(`App is listening to ${port}`)
})

