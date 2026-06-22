import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
      process.env.NEXT_PUBLIC_SITE_URL || "https://ugandansocietybc.ca";

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
      success_url: `${baseUrl}/donations?payment=success`,
      cancel_url: `${baseUrl}/donations?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Donation Checkout Error:", error);

    return NextResponse.json(
      { error: "Unable to create donation checkout session." },
      { status: 500 }
    );
  }
}