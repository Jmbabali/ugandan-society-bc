import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature." },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const memberId = session.metadata?.member_id;

      if (memberId) {
        const { error } = await supabaseAdmin
          .from("Members")
          .update({
            payment_status: "Paid",
            payment_method: "Stripe",
            payment_date: new Date().toISOString(),
          })
          .eq("member_id", memberId);

        if (error) {
          console.error("Member payment update error:", error);
        }
      }

      const { error: donationError } = await supabaseAdmin
        .from("Donations")
        .update({
          payment_status: "Paid",
        })
        .eq("stripe_session_id", session.id);

      if (donationError) {
        console.error("Donation update error:", donationError);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Stripe webhook error:", error.message);

    return NextResponse.json({ error: "Webhook error." }, { status: 400 });
  }
}