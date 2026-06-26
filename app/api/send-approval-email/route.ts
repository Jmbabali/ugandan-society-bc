import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const {
      toEmail,
      memberName,
      memberId,
      issueDate,
      expiryDate,
      cardLink,
    } = await req.json();

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
      subject: "Your USBC Membership Has Been Approved",
      html: `
        <h2>Congratulations ${memberName}!</h2>

        <p>Your membership application has been approved.</p>

        <table cellpadding="6">
          <tr><td><strong>Member ID</strong></td><td>${memberId}</td></tr>
          <tr><td><strong>Issue Date</strong></td><td>${issueDate}</td></tr>
          <tr><td><strong>Expiry Date</strong></td><td>${expiryDate}</td></tr>
        </table>

        <p>
          <a href="${cardLink}"
             style="background:#111827;color:#fff;padding:12px 20px;text-decoration:none;border-radius:6px;">
             View Digital Membership Card
          </a>
        </p>

        <p>Thank you for being part of the Ugandan Society in BC.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Failed to send approval email." },
      { status: 500 }
    );
  }
}