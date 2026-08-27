import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

import { errorResponse, successResponse } from "../utils/response";

export async function getFeatures(req: Request, res: Response) {
  try {
    const features = await prisma.feature.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return successResponse(res, "Features fetched successfully", features);
  } catch (error) {
    console.error("Get features error:", error);

    return errorResponse(
      res,
      500,
      "Failed to fetch features",
      "FETCH_FEATURES_FAILED",
    );
  }
}
