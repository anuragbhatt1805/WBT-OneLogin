import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const User_Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    access_token: {
        type: String
    },
    refresh_token: {
        type: String
    },
    userGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserGroup"
    },
    extras: {
        default: {},
        type: mongoose.Schema.Types.Mixed
    },
    verified: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

User_Schema.pre("save",async  function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hashSync(this.password, 10);
    }
    next();
});

User_Schema.methods.verifyPassword = async function (password){
    return await bcrypt.compare(password, this.password);
}

User_Schema.methods.isVerified = function () {
    return this.verified;
}

User_Schema.methods.generateAccessToken = async function() {
    return await jwt.sign(
        {
            _id: this._id,
            email: this.email,
            phone: this.phone
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

User_Schema.methods.generateRefreshToken = async function() {
    return await jwt.sign(
        {
            _id: this._id,
            email: this.email,
            phone: this.phone
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}