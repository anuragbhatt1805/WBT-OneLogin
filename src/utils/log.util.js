import fs from "node:fs/promises";
import path from "node:path";

export const logInfo = async (type, message) => {
    if (process.env.NODE_ENV === "development") {
        // Log to console
        console.log(`[${type}] ${message}`);
    } else {
        // Log to server
        const date = new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'})
        if (type === "ERROR"){
            await fs.appendFile(path.join(process.cwd(),"src","logs","error.log"), `${date}: [${type}] ${message}\n`);
        } else {
            await fs.appendFile(path.join(process.cwd(),"src","logs","info.log"), `${date}: [${type}] ${message}\n`);
        }
    }
}

export const logError = async (message) => {
    if (process.env.NODE_ENV === "development") {
        // Log to console
        console.log(`${message}`);
    } else {
        // Log to server
        const date = new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'})
        await fs.appendFile(path.join(process.cwd(),"src","logs","error.log"), `${date}: [${type}] ${message}\n`);
    }
}

