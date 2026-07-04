import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getAmount(plan: string) {
  if (plan === "Annual - $300") return 300;
  if (plan === "Half-Year - $150") return 150;
  if (plan === "Quarterly - $75") return 75;
  return 0;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const amount = getAmount(body.membershipPlan);

    if (!amount) {
      return NextResponse.json(
        { error: "Invalid business membership plan." },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.ugandansocietybc.ca";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: body.businessEmail,
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: `USBC Business Hub Membership - ${body.membershipPlan}`,
              description: body.businessName,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/business-hub/submit/success`,
      cancel_url: `${baseUrl}/business-hub/submit?payment=cancelled`,
      metadata: {
        business_id: body.businessId,
        business_name: body.businessName,
        business_email: body.businessEmail,
        membership_plan: body.membershipPlan,
        payment_type: "business_hub",
      },
    });

    const { error } = await supabaseAdmin
      .from("Businesses")
      .update({
        stripe_session_id: session.id,
      })
      .eq("business_id", body.businessId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unable to create checkout session." },
      { status: 500 }
    );
  }
}