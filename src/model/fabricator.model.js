import mongoose from 'mongoose';

export const Fabricator_Schema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        unique: true
    },
    description : {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
});