import mongoose from "mongoose";
const ageValidator = (value) => {
    return value >= 18 && value <= 100;
}
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    username: String,
    dateOfBirth: {
        type: Date,
        required: true
    },
    age: {
        type: Number,
        validate: {
            validator: ageValidator,
            message: 'Age must be between 18 and 100'
        },
        default: 18
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    }
}, {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author'
});

userSchema.virtual('postCount', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author',
    count: true
})
const UserModel = mongoose.model('User', userSchema);
export {UserModel};