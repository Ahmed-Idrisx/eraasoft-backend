import { Router } from "express";

import { createEnrollment } from "../controllers/enrollment.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, createEnrollment);

export default router;
