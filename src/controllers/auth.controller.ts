import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient, OtpType } from "@prisma/client";

import { compareOtp, generateOtp, hashOtp } from "../utils/otp";
import { sendOtpEmail } from "../services/email.service";
import { generateToken } from "../utils/jwt";
import { successResponse, errorResponse } from "../utils/response";

const prisma = new PrismaClient();

export async function register(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return errorResponse(
        res,
        400,
        "All required fields must be provided",
        "MISSING_REQUIRED_FIELDS",
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse(
        res,
        409,
        "Email already exists",
        "EMAIL_ALREADY_EXISTS",
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: passwordHash,
        phone,
      },
    });

    const otp = generateOtp();
    const codeHash = await hashOtp(otp);

    await prisma.otp.deleteMany({
      where: {
        userId: user.id,
        type: OtpType.EMAIL_VERIFICATION,
      },
    });

    await prisma.otp.create({
      data: {
        userId: user.id,
        codeHash,
        type: OtpType.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendOtpEmail(user.email, otp, "EMAIL_VERIFICATION");

    return successResponse(
      res,
      "Account created successfully. Please check your email for the verification code.",
      [],
      201,
    );
  } catch (error) {
    console.error("Register error:", error);

    return errorResponse(
      res,
      500,
      "Something went wrong",
      "INTERNAL_SERVER_ERROR",
    );
  }
}

export async function verifyOtp(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return errorResponse(
        res,
        400,
        "Email and OTP are required",
        "MISSING_EMAIL_OR_OTP",
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return errorResponse(res, 404, "User not found", "USER_NOT_FOUND");
    }

    if (user.isVerified) {
      return errorResponse(
        res,
        400,
        "Email is already verified",
        "EMAIL_ALREADY_VERIFIED",
      );
    }

    const otpRecord = await prisma.otp.findFirst({
      where: {
        userId: user.id,
        type: OtpType.EMAIL_VERIFICATION,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      return errorResponse(res, 400, "OTP not found", "OTP_NOT_FOUND");
    }

    if (otpRecord.expiresAt < new Date()) {
      await prisma.otp.delete({
        where: {
          id: otpRecord.id,
        },
      });

      return errorResponse(res, 400, "OTP has expired", "OTP_EXPIRED");
    }

    const isValid = await compareOtp(otp, otpRecord.codeHash);

    if (!isValid) {
      return errorResponse(res, 400, "Invalid OTP", "INVALID_OTP");
    }

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          isVerified: true,
        },
      }),

      prisma.otp.delete({
        where: {
          id: otpRecord.id,
        },
      }),
    ]);

    return successResponse(res, "Email verified successfully", []);
  } catch (error) {
    console.error("Verify OTP error:", error);

    return errorResponse(
      res,
      500,
      "Something went wrong",
      "INTERNAL_SERVER_ERROR",
    );
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(
        res,
        400,
        "Email and password are required",
        "MISSING_EMAIL_OR_PASSWORD",
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return errorResponse(
        res,
        401,
        "Invalid email or password",
        "INVALID_CREDENTIALS",
      );
    }

    if (!user.isVerified) {
      return errorResponse(
        res,
        403,
        "Please verify your email first",
        "EMAIL_NOT_VERIFIED",
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return errorResponse(
        res,
        401,
        "Invalid email or password",
        "INVALID_CREDENTIALS",
      );
    }

    const token = generateToken(user.id);

    return successResponse(res, "Login successful", [
      {
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          bio: user.bio,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
      },
    ]);
  } catch (error) {
    console.error("Login error:", error);

    return errorResponse(
      res,
      500,
      "Something went wrong",
      "INTERNAL_SERVER_ERROR",
    );
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 400, "Email is required", "EMAIL_REQUIRED");
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // لا نكشف إذا كان الإيميل موجودًا أم لا
    if (!user) {
      return successResponse(
        res,
        "If the email exists, an OTP has been sent",
        [],
      );
    }

    const otp = generateOtp();
    const codeHash = await hashOtp(otp);

    await prisma.otp.deleteMany({
      where: {
        userId: user.id,
        type: OtpType.PASSWORD_RESET,
      },
    });

    await prisma.otp.create({
      data: {
        userId: user.id,
        codeHash,
        type: OtpType.PASSWORD_RESET,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendOtpEmail(user.email, otp, "PASSWORD_RESET");

    return successResponse(
      res,
      "If the email exists, an OTP has been sent",
      [],
    );
  } catch (error) {
    console.error("Forgot password error:", error);

    return errorResponse(
      res,
      500,
      "Something went wrong",
      "INTERNAL_SERVER_ERROR",
    );
  }
}

export async function verifyResetOtp(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return errorResponse(
        res,
        400,
        "Email and OTP are required",
        "MISSING_EMAIL_OR_OTP",
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return errorResponse(res, 400, "Invalid OTP", "INVALID_OTP");
    }

    const otpRecord = await prisma.otp.findFirst({
      where: {
        userId: user.id,
        type: OtpType.PASSWORD_RESET,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      return errorResponse(
        res,
        400,
        "Invalid or expired OTP",
        "INVALID_OR_EXPIRED_OTP",
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      await prisma.otp.delete({
        where: {
          id: otpRecord.id,
        },
      });

      return errorResponse(res, 400, "OTP has expired", "OTP_EXPIRED");
    }

    const isValid = await compareOtp(otp, otpRecord.codeHash);

    if (!isValid) {
      return errorResponse(res, 400, "Invalid OTP", "INVALID_OTP");
    }

    return successResponse(res, "OTP verified successfully", []);
  } catch (error) {
    console.error("Verify reset OTP error:", error);

    return errorResponse(
      res,
      500,
      "Something went wrong",
      "INTERNAL_SERVER_ERROR",
    );
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return errorResponse(
        res,
        400,
        "Email, OTP and new password are required",
        "MISSING_REQUIRED_FIELDS",
      );
    }

    if (newPassword.length < 8) {
      return errorResponse(
        res,
        400,
        "Password must be at least 8 characters",
        "WEAK_PASSWORD",
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return errorResponse(res, 400, "Invalid request", "INVALID_REQUEST");
    }

    const otpRecord = await prisma.otp.findFirst({
      where: {
        userId: user.id,
        type: OtpType.PASSWORD_RESET,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      return errorResponse(
        res,
        400,
        "Invalid or expired OTP",
        "INVALID_OR_EXPIRED_OTP",
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      await prisma.otp.delete({
        where: {
          id: otpRecord.id,
        },
      });

      return errorResponse(res, 400, "OTP has expired", "OTP_EXPIRED");
    }

    const isValid = await compareOtp(otp, otpRecord.codeHash);

    if (!isValid) {
      return errorResponse(res, 400, "Invalid OTP", "INVALID_OTP");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: passwordHash,
        },
      }),

      prisma.otp.delete({
        where: {
          id: otpRecord.id,
        },
      }),
    ]);

    return successResponse(res, "Password reset successfully", []);
  } catch (error) {
    console.error("Reset password error:", error);

    return errorResponse(
      res,
      500,
      "Something went wrong",
      "INTERNAL_SERVER_ERROR",
    );
  }
}
