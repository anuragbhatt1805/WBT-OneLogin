import mongoose from "mongoose";

const CompanyColorCode = new mongoose.Schema({
    primary: {
        type: String,
        required: true,
        default: "#6adb45"
    },
    secondary: {
        type: String,
        required: true,
        default: "#858889"
    },
})

export const Company_Schema = new mongoose.Schema({
    companyName : {
        type: String,
        required: true,
        unique: true
        
    },
    companyId : {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    companyAddress : {
        type: String
    },
    companyEmail : {
        type: String,
        required: true,
        unique: true
    },
    companyPhone : {
        type: String,
        unique: true
    },
    companyWebsite : {
        type: String,
        unique: true
    },
    companyLogo: {
        type: String,
        required: true
    },
    companyEstablished: {
        type: Number
    },
    companyType: {
        type: String
    },
    companySize: {
        type: String
    },
    companyCountry: {
        type: String
    },
    companyColorCode:{
        CompanyColorCode
    }
}, {
    timestamps: true
});