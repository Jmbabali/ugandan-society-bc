import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { donorName, donorEmail, category, amount } = body;

    if (!donorName || !donorEmail || !category || !amount) {
      return NextResponse.json(
        { error: "Missing donation details." },
        { status: 400 }
      );
    }

    const donationAmount = Number(amount);

    if (donationAmount < 1) {
      return NextResponse.json(
        { error: "Donation amount must be at least $1." },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: donorEmail,
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: `USBC Donation - ${category}`,
              description: `Donation from ${donorName}`,
            },
            unit_amount: Math.round(donationAmount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        donor_name: donorName,
        donor_email: donorEmail,
        donation_category: category,
        donation_amount: String(donationAmount),
      },
      success_url: `${baseUrl}/donations/success`,
      cancel_url: `${baseUrl}/donations?payment=cancelled`,
    });

    const { error: donationError } = await supabaseAdmin
      .from("Donations")
      .insert({
        donor_name: donorName,
        donor_email: donorEmail,
        donation_category: category,
        amount: donationAmount,
        stripe_session_id: session.id,
        payment_status: "Pending",
      });

    if (donationError) {
      console.error("Donation Save Error:", donationError);
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Donation Checkout Error:", error);

    return NextResponse.json(
      { error: "Unable to create donation checkout session." },
      { status: 500 }
    );
  }
}