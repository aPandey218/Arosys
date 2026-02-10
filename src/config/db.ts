import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    try {
        const MONGO_URI = process.env.MONGO_URI;

        if (!MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        const options = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(MONGO_URI, options);

        console.log("MongoDB connected successfully");
        console.log(`Database: ${mongoose.connection.name}`);

        // Handle connection events
        mongoose.connection.on("error", (err) => {
            console.error(" MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("MongoDB disconnected");
        });


        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            console.log("🔌 MongoDB connection closed due to app termination");
            process.exit(0);
        });

    } catch (error) {
        console.error(" MongoDB connection failed:", error);
        process.exit(1);
    }
};


export const disconnectDB = async (): Promise<void> => {
    try {
        await mongoose.connection.close();
        console.log(" MongoDB disconnected successfully");
    } catch (error) {
        console.error(" Error disconnecting from MongoDB:", error);
        throw error;
    }
};


export const isConnected = (): boolean => {
    return mongoose.connection.readyState === 1;
};
