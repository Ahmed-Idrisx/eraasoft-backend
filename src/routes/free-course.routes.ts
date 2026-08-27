import { Router } from "express";
import {
  getFreeCourseBySlug,
  getFreeCourses,
} from "../controllers/free-course.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getFreeCourses);
router.get("/:slug", authenticate, getFreeCourseBySlug);
export default router;
