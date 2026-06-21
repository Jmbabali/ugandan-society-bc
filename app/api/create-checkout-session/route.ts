import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

function getMembershipPrice(membershipType: string) {
  if (membershipType === "Adults") return 5000;
  if (membershipType === "Student member") return 3000;
  if (membershipType === "Corporate/Partner") return 20000;
  if (membershipType === "Honorary") return 0;

  return 0;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      membershipType,
      memberName,
      memberEmail,
      memberId,
    } = body;

    const amount = getMembershipPrice(membershipType);

    if (!amount) {
      return NextResponse.json(
        { error: "No payment required for this membership type." },
        { status: 400 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: memberEmail,
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: `USBC ${membershipType} Membership`,
              description: `Membership payment for ${memberName}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        member_id: memberId || "",
        member_name: memberName || "",
        member_email: memberEmail || "",
        membership_type: membershipType || "",
      },
      success_url: `${request.headers.get(
        "origin"
      )}/membership/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/membership`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Stripe checkout error." },
      { status: 500 }
    );
  }
}