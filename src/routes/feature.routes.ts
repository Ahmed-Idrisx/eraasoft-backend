import { Router } from "express";
import { getFeatures } from "../controllers/feature.controller";

const router = Router();

router.get("/", getFeatures);

export default router;
