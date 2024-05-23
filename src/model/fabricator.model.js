import mongoose from 'mongoose';

export const Fabricator_Schema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        unique: true
    },
    clientName: {
        type: String,
        required: true
    },
    clientPhone: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
});