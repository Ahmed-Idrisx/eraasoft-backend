import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

import { successResponse, errorResponse } from "../utils/response";

export async function getFaqs(req: Request, res: Response) {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return successResponse(res, "FAQs fetched successfully", faqs);
  } catch (error) {
    console.error("Get FAQs error:", error);

    return errorResponse(res, 500, "Failed to fetch FAQs", "FETCH_FAQS_FAILED");
  }
}
