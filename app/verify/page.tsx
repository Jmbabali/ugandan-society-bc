import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const id = params.id;

  if (!id) {
    return (
      <main className="min-h-screen bg-gray-100 px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-xl">
          <h1 className="text-4xl font-black text-red-600">
            No Member ID Provided
          </h1>

          <p className="mt-4 text-gray-700">
            Please scan a valid USBC membership QR code.
          </p>
        </div>
      </main>
    );
  }

  const { data: member } = await supabase
    .from("Members")
    .select("*")
    .eq("member_id", id)
    .single();

  if (!member) {
    return (
      <main className="min-h-screen bg-gray-100 px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-xl">
          <h1 className="text-4xl font-black text-red-600">
            Membership Not Found
          </h1>

          <p className="mt-4 text-gray-700">
            This membership ID could not be verified in the USBC system.
          </p>

          <p className="mt-6 rounded-xl bg-gray-100 p-4 font-bold text-gray-950">
            {id}
          </p>
        </div>
      </main>
    );
  }

  const isApproved = member.status === "Approved";
  const today = new Date();
  const expiryDate = member.expiry_date
    ? new Date(member.expiry_date)
    : null;

  const isExpired = expiryDate ? expiryDate < today : false;
  const isValid = isApproved && !isExpired;

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-20">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-xl">
        <div className="text-center">
          <p className="mb-4 font-bold uppercase tracking-widest text-red-600">
            USBC Membership Verification
          </p>

          {isValid ? (
            <h1 className="text-5xl font-black text-green-700">
              Valid Member
            </h1>
          ) : (
            <h1 className="text-5xl font-black text-red-600">
              Not Valid
            </h1>
          )}

          <p className="mt-4 text-gray-700">
            Ugandan Society in BC membership verification result.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border bg-gray-50 p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase text-gray-500">
                Member Name
              </p>
              <p className="text-2xl font-black text-gray-950">
                {member.first_name} {member.last_name}
              </p>
            </div>

            <div>
              <p className="text-sm font-bold uppercase text-gray-500">
                Member ID
              </p>
              <p className="text-2xl font-black text-red-600">
                {member.member_id}
              </p>
            </div>

            <div>
              <p className="text-sm font-bold uppercase text-gray-500">
                Status
              </p>
              <p className="text-xl font-bold text-gray-950">
                {member.status}
              </p>
            </div>

            <div>
              <p className="text-sm font-bold uppercase text-gray-500">
                Category
              </p>
              <p className="text-xl font-bold text-gray-950">
                {member.member_category}
              </p>
            </div>

            <div>
              <p className="text-sm font-bold uppercase text-gray-500">
                Issued
              </p>
              <p className="text-xl font-bold text-gray-950">
                {member.issue_date || "Not issued"}
              </p>
            </div>

            <div>
              <p className="text-sm font-bold uppercase text-gray-500">
                Expires
              </p>
              <p className="text-xl font-bold text-gray-950">
                {member.expiry_date || "No expiry date"}
              </p>
            </div>
          </div>
        </div>

        {!isValid && (
          <div className="mt-8 rounded-2xl bg-red-50 p-6 text-red-700">
            <p className="font-bold">
              This membership is not currently valid.
            </p>

            <p className="mt-2">
              It may be pending approval, expired, rejected, or inactive.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}