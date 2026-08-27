import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

import { successResponse, errorResponse } from "../utils/response";

export async function getCourses(req: Request, res: Response) {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        image: true,
        practicalAssignmentsNumber: true,
        courseProjectsNumber: true,
        weeksNumber: true,
        hoursNumber: true,
        rating: true,
        reviewsCount: true,
      },
    });

    return successResponse(res, "Courses fetched successfully", courses);
  } catch (error) {
    console.error("Get courses error:", error);

    return errorResponse(
      res,
      500,
      "Failed to fetch courses",
      "FETCH_COURSES_FAILED",
    );
  }
}

export async function getCourseBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    if (typeof slug !== "string") {
      return errorResponse(res, 400, "Invalid course slug", "INVALID_SLUG");
    }

    const course = await prisma.course.findUnique({
      where: {
        slug,
      },
    });

    if (!course) {
      return errorResponse(res, 404, "Course not found", "COURSE_NOT_FOUND");
    }

    return successResponse(res, "Course fetched successfully", [course]);
  } catch (error) {
    console.error("Get course by slug error:", error);

    return errorResponse(
      res,
      500,
      "Failed to fetch course",
      "INTERNAL_SERVER_ERROR",
    );
  }
}
