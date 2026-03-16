import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps: true,
    id: false,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, id: false  }
});

const PostModel = mongoose.model('Post', postSchema);
export {PostModel};