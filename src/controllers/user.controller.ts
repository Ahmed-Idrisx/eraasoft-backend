import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

import { errorResponse, successResponse } from "../utils/response";

export async function getMe(req: Request, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        bio: true,
        avatar: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return errorResponse(res, 404, "User not found", "USER_NOT_FOUND");
    }

    return successResponse(res, "User profile fetched successfully", [user]);
  } catch (error) {
    console.error("Get me error:", error);

    return errorResponse(
      res,
      500,
      "Failed to fetch user profile",
      "INTERNAL_SERVER_ERROR",
    );
  }
}

export async function updateMe(req: Request, res: Response) {
  try {
    const { firstName, lastName, phone, bio } = req.body;

    const user = await prisma.user.update({
      where: {
        id: req.userId,
      },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(phone !== undefined && { phone }),
        ...(bio !== undefined && { bio }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        bio: true,
        avatar: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(res, "Profile updated successfully", [user]);
  } catch (error) {
    console.error("Update me error:", error);

    return errorResponse(
      res,
      500,
      "Failed to update profile",
      "INTERNAL_SERVER_ERROR",
    );
  }
}
