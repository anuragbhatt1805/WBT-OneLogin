import dotenv from 'dotenv';
import { connectDB } from './src/db/index.js';
import { app } from './src/app.js';
import { logInfo } from  "./src/utils/log.util.js";

dotenv.config();

connectDB().then(
    () => {
        app.listen(process.env.PORT || 3000, () => {
            logInfo("SERVER", `Server is running on port ${process.env.PORT || 3000}`);
        });
        app.on('error', (err) => {
            logInfo("ERROR", `Error occurred: ${err}`);
        });
    }
).catch(
    (err) => {
        logInfo("ERROR", `Error connecting to MongoDB: ${err}`);
    }
);