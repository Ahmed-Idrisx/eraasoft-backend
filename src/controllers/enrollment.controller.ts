import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

import { successResponse, errorResponse } from "../utils/response";

export async function createEnrollment(req: Request, res: Response) {
  try {
    const { courseId, attendanceMethod, branch } = req.body;

    const parsedCourseId = Number(courseId);

    if (!Number.isInteger(parsedCourseId) || parsedCourseId <= 0) {
      return errorResponse(res, 400, "Invalid course ID", "INVALID_COURSE_ID");
    }

    if (!attendanceMethod) {
      return errorResponse(
        res,
        400,
        "Attendance method is required",
        "INVALID_ATTENDANCE_METHOD",
      );
    }

    const userId = req.userId;

    const course = await prisma.course.findUnique({
      where: {
        id: parsedCourseId,
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    if (!course) {
      return errorResponse(res, 404, "Course not found", "COURSE_NOT_FOUND");
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: parsedCourseId,
        },
      },
    });

    if (existingEnrollment) {
      return errorResponse(
        res,
        409,
        "You are already enrolled in this course",
        "ALREADY_ENROLLED",
      );
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId: parsedCourseId,
        attendanceMethod,
        branch: branch || null,
      },
      select: {
        id: true,
        courseId: true,
        attendanceMethod: true,
        branch: true,
        createdAt: true,
        course: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });

    return successResponse(res, "Enrollment created successfully", [
      enrollment,
    ]);
  } catch (error) {
    console.error("Create enrollment error:", error);

    return errorResponse(
      res,
      500,
      "Failed to create enrollment",
      "CREATE_ENROLLMENT_FAILED",
    );
  }
}
