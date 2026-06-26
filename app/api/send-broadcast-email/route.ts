import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { toEmail, memberName, subject, message } = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_PORT === "465",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Ugandan Society in BC" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject,
      html: `
        <p>Dear ${memberName},</p>
        <p>${message.replace(/\n/g, "<br />")}</p>
        <p>Ugandan Society in BC</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to send broadcast email." },
      { status: 500 }
    );
  }
}