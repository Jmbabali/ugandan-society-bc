import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function getMembershipPrice(membershipType: string) {
  if (membershipType === "Adults - $50") return 50;
  if (membershipType === "Student Member - $30") return 30;
  if (membershipType === "Corporate / Partner - $200") return 200;
  if (membershipType === "Honorary - $0") return 0;
  return 0;
}

export async function GET() {
  return NextResponse.json(
    { message: "Stripe checkout route is working. Use POST to create a session." },
    { status: 405 }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { membershipType, memberName, memberEmail, memberId } = body;

    const amount = getMembershipPrice(membershipType);

    if (!membershipType || !memberName || !memberEmail || !memberId) {
      return NextResponse.json(
        { error: "Missing required membership payment details." },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "This membership type does not require payment." },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://ugandansocietybc.ca";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: memberEmail,
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: `USBC Membership - ${membershipType}`,
              description: `Membership fee for ${memberName}`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        member_id: memberId,
        member_name: memberName,
        member_email: memberEmail,
        membership_type: membershipType,
      },
      success_url: `${baseUrl}/payment-success?member=${memberId}`,
      cancel_url: `${baseUrl}/membership?payment=cancelled&member=${memberId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);

    return NextResponse.json(
      { error: "Unable to create Stripe checkout session." },
      { status: 500 }
    );
  }
}