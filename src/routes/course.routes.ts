import { Router } from "express";
import { getCourseBySlug, getCourses } from "../controllers/course.controller";

const router = Router();

router.get("/", getCourses);
router.get("/:slug", getCourseBySlug);

export default router;
