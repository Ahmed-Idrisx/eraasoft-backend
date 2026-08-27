import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import articleRoutes from "./routes/article.routes";
import courseRoutes from "./routes/course.routes";
import faqRoutes from "./routes/faq.routes";
import featureRoutes from "./routes/feature.routes";
import freeCourseRoutes from "./routes/free-course.routes";
import journeyRoutes from "./routes/journey.routes";
import partnerRoutes from "./routes/partner.routes";
import userRoutes from "./routes/user.routes";
import { globalErrorHandler, notFound } from "./middleware/error.middleware";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

app.use(express.json());

// Auth
app.use("/api/auth", authRoutes);

// Public data
app.use("/api/articles", articleRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/features", featureRoutes);
app.use("/api/free-courses", freeCourseRoutes);
app.use("/api/journey", journeyRoutes);
app.use("/api/partners", partnerRoutes);

// Users
app.use("/api/users", userRoutes);

// 404
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

export default app;
