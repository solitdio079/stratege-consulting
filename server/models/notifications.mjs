import mongoose, {Schema} from "mongoose"

const notificationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    from: {
        id: {
            type:String,
            required: true
        },
        avatar:{
            type:String,
            required: true
        }
    }


}, {timestamps: true})

export default mongoose.model("Notification", notificationSchema)