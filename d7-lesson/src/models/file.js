import mongoose  from "mongoose";
const fileSchema = new mongoose.Schema({
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    }, 
    filename: {
        type: String,
        require: true,
        trim: true
    },
    type: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    key: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    id: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

const FileModel = mongoose.model('File', fileSchema);
export default FileModel;