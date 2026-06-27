"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Member = {
  id: number;
  member_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  membership_type: string;
  member_category: string;
  status: string;
  payment_status: string | null;
  payment_amount: number | null;
  payment_method: string | null;
  payment_date: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  emergency_contact: string | null;
  photo_url: string | null;
  approved_by: string | null;
  qr_code: string | null;
};

const emptyMember = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address: "",
  membership_type: "Adults - $50",
  member_category: "General Member",
  status: "Approved",
  payment_status: "Paid",
  payment_amount: "50",
  payment_method: "Already Paid",
  emergency_contact: "",
  photo_url: "",
};

export default function AdminMembersPage() {
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState(emptyMember);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("usbc_admin_logged_in");

    if (isLoggedIn !== "true") {
      router.push("/admin/login");
      return;
    }

    setCheckingLogin(false);
    loadMembers();
  }, [router]);

  async function loadMembers() {
    const { data, error } = await supabase
      .from("Members")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMembers(data || []);
  }

  function formatDate(date: Date) {
    return date.toISOString().split("T")[0];
  }

  async function getNextMemberId() {
    const { data, error } = await supabase.from("Members").select("member_id");

    if (error) throw error;

    let highestNumber = 0;

    data?.forEach((item) => {
      const currentId = item.member_id;
      if (!currentId) return;

      const match = currentId.match(/^USBC-(\d{4})$/);
      if (!match) return;

      const number = Number(match[1]);
      if (number > highestNumber) highestNumber = number;
    });

    return `USBC-${String(highestNumber + 1).padStart(4, "0")}`;
  }

  async function addManualMember() {
    if (!newMember.first_name || !newMember.last_name || !newMember.email || !newMember.photo_url) {
      alert("First name, last name, email, and photo_url are required.");
      return;
    }

    setMessage("Adding member...");

    try {
      const memberId = await getNextMemberId();

      const issueDate = new Date();
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      const issueDateString = formatDate(issueDate);
      const expiryDateString = formatDate(expiryDate);

      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

      const qrCodeUrl = `${baseUrl}/verify?id=${memberId}`;

      const { error } = await supabase.from("Members").insert([
        {
          member_id: memberId,
          first_name: newMember.first_name,
          last_name: newMember.last_name,
          email: newMember.email,
          phone: newMember.phone,
          address: newMember.address,
          membership_type: newMember.membership_type,
          member_category: newMember.member_category,
          status: newMember.status,
          payment_status: newMember.payment_status,
          payment_amount: Number(newMember.payment_amount || 0),
          payment_method: newMember.payment_method,
          payment_date:
            newMember.payment_status === "Paid"
              ? new Date().toISOString()
              : null,
          issue_date: issueDateString,
          expiry_date: expiryDateString,
          emergency_contact: newMember.emergency_contact,
          approved_by: "USBC Admin",
          qr_code: qrCodeUrl,
        },
      ]);

      if (error) throw error;

      setMessage(`${memberId} added successfully.`);
      setNewMember(emptyMember);
      setShowAddForm(false);
      await loadMembers();
    } catch (error: any) {
      setMessage(error.message || "Failed to add member.");
    }
  }

  async function deleteMember(member: Member) {
    const confirmed = window.confirm(
      `Delete ${member.first_name} ${member.last_name}?`
    );

    if (!confirmed) return;

    const { error } = await supabase.from("Members").delete().eq("id", member.id);

    if (error) {
      setMessage(error.message);
      return;
    }

async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);

  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("member-photos")
    .upload(fileName, file);

  if (error) {
    alert(error.message);
    setUploading(false);
    return;
  }

  const { data } = supabase.storage
    .from("member-photos")
    .getPublicUrl(fileName);

  setNewMember({
    ...newMember,
    photo_url: data.publicUrl,
  });

  setUploading(false);
}

    setMessage("Member deleted.");
    await loadMembers();
  }

  const filteredMembers = members.filter((member) => {
    const s = search.toLowerCase();

    return (
      member.first_name?.toLowerCase().includes(s) ||
      member.last_name?.toLowerCase().includes(s) ||
      member.email?.toLowerCase().includes(s) ||
      member.phone?.toLowerCase().includes(s) ||
      member.member_id?.toLowerCase().includes(s) ||
      member.status?.toLowerCase().includes(s) ||
      member.payment_status?.toLowerCase().includes(s)
    );
  });

async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;

  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("member-photos")
    .upload(fileName, file);

  if (error) {
    alert(error.message);
    return;
  }

  const { data } = supabase.storage
    .from("member-photos")
    .getPublicUrl(fileName);

  setNewMember({
    ...newMember,
    photo_url: data.publicUrl,
  });
}

  if (checkingLogin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
        <p className="rounded-3xl bg-white p-8 font-bold shadow-xl">
          Checking admin access...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-black uppercase tracking-widest text-red-600">
              USBC Admin
            </p>

            <h1 className="text-5xl font-black text-gray-950">
              Members
            </h1>

            <p className="mt-3 text-gray-600">
              Manage members, manual registrations, payments, and digital cards.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="rounded-xl bg-gray-950 px-6 py-4 font-bold text-white hover:bg-gray-800"
          >
            {showAddForm ? "Close Form" : "+ Add Member"}
          </button>
        </div>

        {message && (
          <p className="mb-6 rounded-xl bg-yellow-100 p-4 font-bold text-gray-950">
            {message}
          </p>
        )}

        {showAddForm && (
          <div className="mb-8 rounded-3xl bg-white p-8 shadow-xl">
            <h2 className="mb-6 text-3xl font-black text-gray-950">
              Add Manual Member
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={newMember.first_name}
                onChange={(e) =>
                  setNewMember({ ...newMember, first_name: e.target.value })
                }
                placeholder="First Name"
                className="rounded-xl border px-4 py-4"
              />

              <input
                value={newMember.last_name}
                onChange={(e) =>
                  setNewMember({ ...newMember, last_name: e.target.value })
                }
                placeholder="Last Name"
                className="rounded-xl border px-4 py-4"
              />

              <input
                value={newMember.email}
                onChange={(e) =>
                  setNewMember({ ...newMember, email: e.target.value })
                }
                placeholder="Email"
                className="rounded-xl border px-4 py-4"
              />

              <input
                value={newMember.phone}
                onChange={(e) =>
                  setNewMember({ ...newMember, phone: e.target.value })
                }
                placeholder="Phone"
                className="rounded-xl border px-4 py-4"
              />

              <input
                value={newMember.address}
                onChange={(e) =>
                  setNewMember({ ...newMember, address: e.target.value })
                }
                placeholder="Address"
                className="rounded-xl border px-4 py-4"
              />

              <input
                value={newMember.emergency_contact}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    emergency_contact: e.target.value,
                  })
                }
                placeholder="Emergency Contact"
                className="rounded-xl border px-4 py-4"
              />

                <label className="block">
                  <span className="mb-2 block font-semibold">Member Photo</span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadPhoto}
                    className="w-full rounded-xl border p-3"
                  />
                </label>

              <select
                value={newMember.membership_type}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    membership_type: e.target.value,
                  })
                }
                className="rounded-xl border px-4 py-4"
              >
                <option>Adults - $50</option>
                <option>Student Member - $30</option>
                <option>Corporate / Partner - $200</option>
                <option>Honorary - $0</option>
              </select>

              <select
                value={newMember.member_category}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    member_category: e.target.value,
                  })
                }
                className="rounded-xl border px-4 py-4"
              >
                <option>General Member</option>
                <option>Executive Committee</option>
                <option>Board of Trustees</option>
                <option>Honorary Member</option>
                <option>Corporate Partner</option>
                <option>Student Member</option>
              </select>

              <select
                value={newMember.payment_status}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    payment_status: e.target.value,
                  })
                }
                className="rounded-xl border px-4 py-4"
              >
                <option>Paid</option>
                <option>Pending</option>
                <option>Waived</option>
                <option>Unpaid</option>
              </select>

              <select
                value={newMember.payment_method}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    payment_method: e.target.value,
                  })
                }
                className="rounded-xl border px-4 py-4"
              >
                <option>Already Paid</option>
                <option>Stripe</option>
                <option>E-Transfer</option>
                <option>Cash</option>
                <option>Cheque</option>
                <option>Waived</option>
              </select>

              <input
                value={newMember.payment_amount}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    payment_amount: e.target.value,
                  })
                }
                placeholder="Amount Paid"
                className="rounded-xl border px-4 py-4"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={addManualMember}
                className="rounded-xl bg-green-600 px-6 py-4 font-bold text-white hover:bg-green-700"
              >
                Save Member & Generate ID
              </button>

              <button
                onClick={() => setShowAddForm(false)}
                className="rounded-xl bg-gray-200 px-6 py-4 font-bold text-gray-900 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mb-8 rounded-3xl bg-white p-6 shadow">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
            className="w-full rounded-xl border px-4 py-4"
          />
        </div>

        <div className="grid gap-6">
          {filteredMembers.map((member) => (
            <div key={member.id} className="rounded-3xl bg-white p-6 shadow">
              <div className="grid gap-6 lg:grid-cols-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-950">
                    {member.first_name} {member.last_name}
                  </h2>
                  <p className="text-gray-600">{member.email}</p>
                  <p className="text-gray-600">{member.phone}</p>
                </div>

                <div>
                  <p className="text-sm font-bold uppercase text-gray-500">
                    Member ID
                  </p>
                  <p className="font-black text-red-600">
                    {member.member_id || "Not assigned"}
                  </p>

                  <p className="mt-3 text-sm font-bold uppercase text-gray-500">
                    Status
                  </p>
                  <p className="font-black">{member.status}</p>
                </div>

                <div>
                  <p className="text-sm font-bold uppercase text-gray-500">
                    Payment
                  </p>
                  <p className="font-black">{member.payment_status || "Unpaid"}</p>
                  <p className="text-sm text-gray-600">
                    ${member.payment_amount || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    {member.payment_method || "No method"}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {member.member_id && (
                    <a
                      href={`/member-card/${member.member_id}`}
                      target="_blank"
                      className="rounded-xl bg-gray-950 px-5 py-3 text-center font-bold text-white hover:bg-gray-800"
                    >
                      View Card
                    </a>
                  )}

                  <button
                    onClick={() => deleteMember(member)}
                    className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <p className="rounded-3xl bg-white p-8 text-center font-bold text-gray-600">
            No members found.
          </p>
        )}
      </div>
    </main>
  );
}