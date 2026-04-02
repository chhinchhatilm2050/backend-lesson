import mongoose from "mongoose";
import bcrypt  from 'bcryptjs';
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
    username: {
        type: String
    },
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
    password: {
        type: String,
        required: true,
        select: false,
        trim: true,
        minLength: 8
    },
    refreshToken: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'editor', 'admin'],
        default: 'user'
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
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

userSchema.virtual('profile', {
    ref: 'Profile',
    localField: '_id',
    foreignField: 'userId'
});


userSchema.virtual('postCount', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author',
    count: true
});

userSchema.pre('save', async function () {
    const saltRounds = 12;
    if(this.isModified('password')) {
        return this.password =  await bcrypt.hash(this.password, saltRounds);
    } 
});


userSchema.methods.isMatch = async function(enterPassword) {
    return await bcrypt.compare(enterPassword, this.password)
}
const UserModel = mongoose.model('User', userSchema);
export {UserModel};