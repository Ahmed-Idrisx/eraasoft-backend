import { Router } from "express";
import {
  getArticleBySlug,
  getArticles,
} from "../controllers/article.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getArticles);
router.get("/:slug", authenticate, getArticleBySlug);

export default router;
