import mongoose, {Schema} from 'mongoose'

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    postId:{
        type: String,
        required: true
    },
    author: {
        avatar: String,
        name: String,
        id:String,
    },
    parent: String
   
}, {timestamps:true})

export default mongoose.model("Comments", commentSchema)