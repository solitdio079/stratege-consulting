import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    avatar: String,
    fcmToken: String
}, {timestamps: true})
export default mongoose.model("User", userSchema)