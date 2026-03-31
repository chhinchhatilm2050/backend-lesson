import mongoose from "mongoose";
const profileSchema = new mongoose.Schema({
    nickname: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

const ProfileModel = mongoose.model('Profile', profileSchema);
export {ProfileModel};
