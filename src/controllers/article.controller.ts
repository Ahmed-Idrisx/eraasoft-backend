import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

import { errorResponse, successResponse } from "../utils/response";

export async function getArticles(req: Request, res: Response) {
  try {
    const articles = await prisma.article.findMany({
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        excerpt: true,
        publishedAt: true,
        views: true,
        author: true,
      },
    });

    return successResponse(res, "Articles fetched successfully", articles);
  } catch (error) {
    console.error("Get articles error:", error);

    return errorResponse(
      res,
      500,
      "Failed to fetch articles",
      "FETCH_ARTICLES_FAILED",
    );
  }
}
export async function getArticleBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    if (typeof slug !== "string") {
      return errorResponse(res, 400, "Invalid article slug", "INVALID_SLUG");
    }

    const article = await prisma.article.findUnique({
      where: {
        slug,
      },
    });

    if (!article) {
      return errorResponse(res, 404, "Article not found", "ARTICLE_NOT_FOUND");
    }

    return successResponse(res, "Article fetched successfully", [article]);
  } catch (error) {
    console.error("Get article by slug error:", error);

    return errorResponse(
      res,
      500,
      "Failed to fetch article",
      "FETCH_ARTICLE_FAILED",
    );
  }
}
