import mongoose from 'mongoose';

export const Fabricator_Schema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        unique: true
    },
    clientInformation: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
});