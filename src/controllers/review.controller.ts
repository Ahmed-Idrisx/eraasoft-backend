import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

import { successResponse, errorResponse } from "../utils/response";

export async function getReviews(req: Request, res: Response) {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        id: "asc",
      },
      select: {
        title: true,
        testimonials: true,
      },
    });

    const reviews = courses.flatMap((course) => {
      const testimonials = course.testimonials as {
        id: number;
        name: string;
        image: string | null;
        message: string;
        stars: number;
      }[];

      return testimonials.map((testimonial) => ({
        id: testimonial.id,
        name: testimonial.name,
        image: testimonial.image,
        message: testimonial.message,
        stars: testimonial.stars,
        courseTitle: course.title,
      }));
    });

    return successResponse(res, "Reviews fetched successfully", reviews);
  } catch (error) {
    console.error("Get reviews error:", error);

    return errorResponse(
      res,
      500,
      "Failed to fetch reviews",
      "FETCH_REVIEWS_FAILED",
    );
  }
}
