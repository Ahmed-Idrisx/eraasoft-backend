import { Router } from "express";
import { getJourneySteps } from "../controllers/journey.controller";

const router = Router();

router.get("/", getJourneySteps);

export default router;
