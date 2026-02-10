import * as express from "express";
import userRoutes from "./routes/User.routes";
import adminRoutes from "./routes/Admin.routes";
import { limiter } from "./middlewares/rateLimit.middleware";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();
app.use(express.json());
app.use("/api", limiter);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandler);

export default app;