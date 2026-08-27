import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

import { errorResponse, successResponse } from "../utils/response";

export async function getPartners(req: Request, res: Response) {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return successResponse(res, "Partners fetched successfully", partners);
  } catch (error) {
    console.error("Get partners error:", error);

    return errorResponse(
      res,
      500,
      "Failed to fetch partners",
      "FETCH_PARTNERS_FAILED",
    );
  }
}
