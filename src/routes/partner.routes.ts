import { Router } from "express";
import { getPartners } from "../controllers/partner.controller";

const router = Router();

router.get("/", getPartners);

export default router;
