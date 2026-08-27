import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendOtpEmail(
  email: string,
  otp: string,
  type: "EMAIL_VERIFICATION" | "PASSWORD_RESET",
) {
  const subject =
    type === "EMAIL_VERIFICATION"
      ? "Verify your EraaSoft account"
      : "Reset your EraaSoft password";

  const title =
    type === "EMAIL_VERIFICATION"
      ? "تأكيد البريد الإلكتروني"
      : "إعادة تعيين كلمة المرور";

  await transporter.sendMail({
    from: `"EraaSoft" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; direction: rtl;">
        <h2>${title}</h2>

        <p>رمز التحقق الخاص بك هو:</p>

        <h1 style="letter-spacing: 8px;">
          ${otp}
        </h1>

        <p>
          هذا الرمز صالح لمدة 10 دقائق فقط.
        </p>

        <p>
          إذا لم تطلب هذا الرمز، يمكنك تجاهل هذه الرسالة.
        </p>
      </div>
    `,
  });
}
