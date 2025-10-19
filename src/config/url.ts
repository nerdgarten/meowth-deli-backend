import dotenv from "dotenv";

dotenv.config();

const urlConfig = {
    front_end: process.env.FRONTEND_URL || "http://localhost:3000",
};

export default urlConfig;
