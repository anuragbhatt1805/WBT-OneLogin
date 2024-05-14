import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
import { logInfo } from  "../utils/log.util.js";

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        logInfo("MONGO", `Connected to ${DB_NAME} database on ${connection?.connection?.host}`);

    } catch (error) {
        logInfo("ERROR", error.message);
        process.exit(1);
    }
}