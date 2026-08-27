import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

import { errorResponse, successResponse } from "../utils/response";

export async function getFreeCourses(req: Request, res: Response) {
  try {
    const freeCourses = await prisma.freeCourse.findMany({
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        image: true,
        isFeatured: true,
        isFree: true,
        videosCount: true,
      },
    });

    return successResponse(
      res,
      "Free courses fetched successfully",
      freeCourses,
    );
  } catch (error) {
    console.error("Get free courses error:", error);

    return errorResponse(
      res,
      500,
      "Failed to fetch free courses",
      "FETCH_FREE_COURSES_FAILED",
    );
  }
}

export async function getFreeCourseBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    if (typeof slug !== "string") {
      return errorResponse(
        res,
        400,
        "Invalid free course slug",
        "INVALID_SLUG",
      );
    }

    const freeCourse = await prisma.freeCourse.findUnique({
      where: {
        slug,
      },
    });

    if (!freeCourse) {
      return errorResponse(
        res,
        404,
        "Free course not found",
        "FREE_COURSE_NOT_FOUND",
      );
    }

    return successResponse(res, "Free course fetched successfully", [
      freeCourse,
    ]);
  } catch (error) {
    console.error("Get free course by slug error:", error);

    return errorResponse(
      res,
      500,
      "Failed to fetch free course",
      "INTERNAL_SERVER_ERROR",
    );
  }
}
