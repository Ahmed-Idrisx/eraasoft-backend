import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

import { errorResponse, successResponse } from "../utils/response";

export async function getJourneySteps(req: Request, res: Response) {
  try {
    const journeySteps = await prisma.journeyStep.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return successResponse(
      res,
      "Journey steps fetched successfully",
      journeySteps,
    );
  } catch (error) {
    console.error("Get journey steps error:", error);

    return errorResponse(
      res,
      500,
      "Failed to fetch journey steps",
      "FETCH_JOURNEY_STEPS_FAILED",
    );
  }
}
