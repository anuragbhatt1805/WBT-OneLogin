import mongoose from "mongoose";

import { UserGroup_Schema } from "./userGroup.model.js";
import { Company_Schema } from "./company.model.js";
import { User_Schema } from "./user.model.js";
import { OTP_Schema } from "./otp.model.js";


export const Company = mongoose.model("Company", Company_Schema);
export const UserGroup = mongoose.model("UserGroup", UserGroup_Schema);
export const User = mongoose.model("User", User_Schema);
export const OTP = mongoose.model("OTP", OTP_Schema);