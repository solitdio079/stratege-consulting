import mongoose, {Schema} from 'mongoose'

const postSchema = new Schema({
    title: {
        type:String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    cover:{
        type: String,
        required: true
    },
    author: {
        avatar: String,
        name: String,
        id:String,
        
    },
    comments: {
        count: Number
    },
    category: {
        type: String,
        required: true
    }
   
}, {timestamps:true})

export default mongoose.model("Posts", postSchema)