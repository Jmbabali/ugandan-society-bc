import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, subject, message } = await req.json();

    // Save to Supabase
    const { error } = await supabase.from("contact_messages").insert({
      first_name: firstName,
      last_name: lastName,
      email,
      subject,
      message,
    });

    if (error) throw error;

    // Send email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
  from: `"Ugandan Society in BC Website" <${process.env.EMAIL_USER}>`,
  replyTo: email,
  to: "info@ugandansocietybc.ca",
  subject: `USBC Contact: ${subject}`,
  html: `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p>${message}</p>
  `,
});

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to send message." },
      { status: 500 }
    );
  }
}