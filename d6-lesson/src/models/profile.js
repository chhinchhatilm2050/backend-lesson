import mongoose from "mongoose";
const profileSchema = new mongoose.Schema({
    nickname: String,
    photo: String
}, {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, id: false  }
})

const ProfileModel = mongoose.model('Profile', profileSchema);
export {ProfileModel};
