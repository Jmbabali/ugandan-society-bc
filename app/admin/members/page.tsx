"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { sendApprovalEmail } from "@/lib/email";
import AdminNav from "@/app/components/AdminNav";

type Member = {
  id: number;
  member_id: string | null;
  application_date: string | null;
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

type EditForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  membership_type: string;
  member_category: string;
  status: string;
  issue_date: string;
  expiry_date: string;
  emergency_contact: string;
};

export default function AdminMembersPage() {
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);

  const [editForm, setEditForm] = useState<EditForm>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    membership_type: "",
    member_category: "",
    status: "",
    issue_date: "",
    expiry_date: "",
    emergency_contact: "",
  });

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

  function handleLogout() {
    localStorage.removeItem("usbc_admin_logged_in");
    router.push("/admin/login");
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

  async function approveMember(member: Member) {
    setMessage("Approving member...");

    try {
      const newMemberId =
        member.member_id && member.member_id.startsWith("USBC-")
          ? member.member_id
          : await getNextMemberId();

      const issueDate = new Date();
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      const issueDateString = formatDate(issueDate);
      const expiryDateString = formatDate(expiryDate);

      const cardLink = `http://localhost:3000/member-card/${newMemberId}`;
      const qrCodeUrl = `http://localhost:3000/verify?id=${newMemberId}`;

      const { error } = await supabase
        .from("Members")
        .update({
          member_id: newMemberId,
          status: "Approved",
          issue_date: issueDateString,
          expiry_date: expiryDateString,
          approved_by: "USBC Admin",
          qr_code: qrCodeUrl,
        })
        .eq("id", member.id);

      if (error) throw error;

      await sendApprovalEmail({
        toEmail: member.email,
        memberName: `${member.first_name} ${member.last_name}`,
        memberId: newMemberId,
        issueDate: issueDateString,
        expiryDate: expiryDateString,
        cardLink,
      });

      setMessage(`${newMemberId} approved successfully and email sent.`);
      await loadMembers();
    } catch (error: any) {
      setMessage(
        error?.message ||
          "Member approval failed or email could not be sent."
      );
    }
  }

  async function rejectMember(member: Member) {
    const confirmed = window.confirm(
      `Are you sure you want to reject ${member.first_name} ${member.last_name}?`
    );

    if (!confirmed) return;

    setMessage("Rejecting member...");

    const { error } = await supabase
      .from("Members")
      .update({ status: "Rejected" })
      .eq("id", member.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Application rejected.");
    await loadMembers();
  }

  async function renewMember(member: Member) {
    const confirmed = window.confirm(
      `Renew membership for ${member.first_name} ${member.last_name} for 1 year?`
    );

    if (!confirmed) return;

    setMessage("Renewing membership...");

    const issueDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const { error } = await supabase
      .from("Members")
      .update({
        status: "Approved",
        issue_date: formatDate(issueDate),
        expiry_date: formatDate(expiryDate),
      })
      .eq("id", member.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Membership renewed for 1 year.");
    await loadMembers();
  }

  async function markPaid(member: Member) {
    setMessage("Updating payment...");

    const { error } = await supabase
      .from("Members")
      .update({
        payment_status: "Paid",
        payment_method: "E-Transfer",
        payment_date: new Date().toISOString(),
      })
      .eq("id", member.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Payment marked as paid.");
    await loadMembers();
  }

  async function markUnpaid(member: Member) {
    setMessage("Updating payment...");

    const { error } = await supabase
      .from("Members")
      .update({
        payment_status: "Unpaid",
        payment_method: null,
        payment_date: null,
      })
      .eq("id", member.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Payment marked as unpaid.");
    await loadMembers();
  }

  async function deleteMember(member: Member) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${member.first_name} ${member.last_name}? This cannot be undone.`
    );

    if (!confirmed) return;

    setMessage("Deleting member...");

    const { error } = await supabase
      .from("Members")
      .delete()
      .eq("id", member.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Member deleted successfully.");
    await loadMembers();
  }

  function exportMembersCSV() {
    const headers = [
      "Member ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Address",
      "Membership Type",
      "Member Category",
      "Status",
      "Payment Status",
      "Payment Amount",
      "Payment Method",
      "Payment Date",
      "Issue Date",
      "Expiry Date",
      "Emergency Contact",
    ];

    const rows = members.map((member) => [
      member.member_id || "",
      member.first_name || "",
      member.last_name || "",
      member.email || "",
      member.phone || "",
      member.address || "",
      member.membership_type || "",
      member.member_category || "",
      member.status || "",
      member.payment_status || "",
      member.payment_amount || 0,
      member.payment_method || "",
      member.payment_date || "",
      member.issue_date || "",
      member.expiry_date || "",
      member.emergency_contact || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "usbc-members.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  function startEdit(member: Member) {
    setEditingMemberId(member.id);

    setEditForm({
      first_name: member.first_name || "",
      last_name: member.last_name || "",
      email: member.email || "",
      phone: member.phone || "",
      address: member.address || "",
      membership_type: member.membership_type || "",
      member_category: member.member_category || "",
      status: member.status || "",
      issue_date: member.issue_date || "",
      expiry_date: member.expiry_date || "",
      emergency_contact: member.emergency_contact || "",
    });
  }

  function cancelEdit() {
    setEditingMemberId(null);
  }

  function handleEditChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  }

  async function saveEdit(member: Member) {
    setMessage("Saving changes...");

    const { error } = await supabase
      .from("Members")
      .update({
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address,
        membership_type: editForm.membership_type,
        member_category: editForm.member_category,
        status: editForm.status,
        issue_date: editForm.issue_date || null,
        expiry_date: editForm.expiry_date || null,
        emergency_contact: editForm.emergency_contact,
      })
      .eq("id", member.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Member details updated successfully.");
    setEditingMemberId(null);
    await loadMembers();
  }

  const today = new Date();

  const totalMembers = members.length;

  const approvedMembers = members.filter(
    (member) => member.status === "Approved"
  ).length;

  const pendingMembers = members.filter(
    (member) => member.status === "Pending"
  ).length;

  const rejectedMembers = members.filter(
    (member) => member.status === "Rejected"
  ).length;

  const expiredMembers = members.filter((member) => {
    if (!member.expiry_date) return false;
    return new Date(member.expiry_date) < today;
  }).length;

  const paidMembers = members.filter(
    (member) => member.payment_status === "Paid"
  ).length;

  const unpaidMembers = members.filter(
    (member) => member.payment_status === "Unpaid"
  ).length;

  const revenueCollected = members.reduce((total, member) => {
    if (member.payment_status === "Paid") {
      return total + (member.payment_amount || 0);
    }

    return total;
  }, 0);

  const filteredMembers = members.filter((member) => {
    const searchText = search.toLowerCase();

    return (
      member.first_name?.toLowerCase().includes(searchText) ||
      member.last_name?.toLowerCase().includes(searchText) ||
      member.email?.toLowerCase().includes(searchText) ||
      member.phone?.toLowerCase().includes(searchText) ||
      member.member_id?.toLowerCase().includes(searchText) ||
      member.status?.toLowerCase().includes(searchText) ||
      member.membership_type?.toLowerCase().includes(searchText) ||
      member.member_category?.toLowerCase().includes(searchText) ||
      member.payment_status?.toLowerCase().includes(searchText) ||
      member.payment_method?.toLowerCase().includes(searchText)
    );
  });

  if (checkingLogin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
        <p className="rounded-3xl bg-white p-8 font-bold text-gray-950 shadow-xl">
          Checking admin access...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-4 font-bold uppercase tracking-widest text-red-600">
              USBC Admin
            </p>

            <h1 className="text-4xl font-black text-gray-950 md:text-6xl">
              Membership Applications
            </h1>

            <p className="mt-4 max-w-3xl text-lg text-gray-700">
              Review applications, approve members, confirm e-Transfer payments,
              renew memberships, export records, edit details, view cards, and
              manage USBC membership records.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <button
              onClick={exportMembersCSV}
              className="rounded-xl bg-gray-950 px-6 py-4 font-bold text-white hover:bg-gray-800"
            >
              Export Members CSV
            </button>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-red-600 px-6 py-4 font-bold text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4 lg:grid-cols-8">
          <div className="rounded-3xl border bg-white p-6 shadow-premium">
            <p className="text-sm font-bold uppercase text-gray-500">Total</p>
            <p className="mt-2 text-4xl font-black text-gray-950">
              {totalMembers}
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-premium">
            <p className="text-sm font-bold uppercase text-gray-500">Approved</p>
            <p className="mt-2 text-4xl font-black text-green-700">
              {approvedMembers}
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-premium">
            <p className="text-sm font-bold uppercase text-gray-500">Pending</p>
            <p className="mt-2 text-4xl font-black text-yellow-600">
              {pendingMembers}
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-premium">
            <p className="text-sm font-bold uppercase text-gray-500">Rejected</p>
            <p className="mt-2 text-4xl font-black text-red-600">
              {rejectedMembers}
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-premium">
            <p className="text-sm font-bold uppercase text-gray-500">Expired</p>
            <p className="mt-2 text-4xl font-black text-gray-700">
              {expiredMembers}
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-premium">
            <p className="text-sm font-bold uppercase text-gray-500">Paid</p>
            <p className="mt-2 text-4xl font-black text-green-700">
              {paidMembers}
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-premium">
            <p className="text-sm font-bold uppercase text-gray-500">Unpaid</p>
            <p className="mt-2 text-4xl font-black text-red-600">
              {unpaidMembers}
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-premium">
            <p className="text-sm font-bold uppercase text-gray-500">Revenue</p>
            <p className="mt-2 text-3xl font-black text-gray-950">
              ${revenueCollected}
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-3xl border bg-white p-6 shadow-premium">
          <label className="mb-2 block text-sm font-bold uppercase text-gray-500">
            Search Members
          </label>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, member ID, status, type, category, payment status, or payment method"
            className="w-full rounded-xl border px-4 py-4 text-gray-950"
          />

          <p className="mt-3 text-sm text-gray-600">
            Showing {filteredMembers.length} of {members.length} records
          </p>
        </div>

        {message && (
          <p className="mb-8 rounded-xl bg-yellow-100 p-4 font-bold text-gray-950">
            {message}
          </p>
        )}

        <div className="grid gap-6">
          {filteredMembers.map((member) => {
            const isEditing = editingMemberId === member.id;

            return (
              <div
                key={member.id}
                className="rounded-3xl border bg-white p-6 shadow-premium"
              >
                {!isEditing ? (
                  <div className="grid gap-6 lg:grid-cols-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        {member.photo_url ? (
                          <img
                            src={member.photo_url}
                            alt={`${member.first_name} ${member.last_name}`}
                            className="h-24 w-24 rounded-xl border object-cover"
                          />
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center rounded-xl border bg-gray-200 text-2xl font-black text-gray-500">
                            {member.first_name?.[0]}
                            {member.last_name?.[0]}
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-bold uppercase text-gray-500">
                          Name
                        </p>

                        <h2 className="text-2xl font-black text-gray-950">
                          {member.first_name} {member.last_name}
                        </h2>

                        <p className="mt-2 text-gray-600">{member.email}</p>
                        <p className="text-gray-600">{member.phone}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-bold uppercase text-gray-500">
                        Membership
                      </p>

                      <p className="font-bold text-gray-950">
                        {member.membership_type}
                      </p>

                      <p className="text-gray-600">{member.member_category}</p>

                      <p className="mt-2 text-sm text-gray-600">
                        {member.address}
                      </p>

                      {member.emergency_contact && (
                        <p className="mt-2 text-sm text-gray-600">
                          Emergency: {member.emergency_contact}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-bold uppercase text-gray-500">
                        Status
                      </p>

                      <p className="font-black text-gray-950">
                        {member.status}
                      </p>

                      <p className="mt-3 text-sm font-bold uppercase text-gray-500">
                        Member ID
                      </p>

                      <p className="font-black text-red-600">
                        {member.member_id &&
                        member.member_id.startsWith("USBC-")
                          ? member.member_id
                          : "Not assigned"}
                      </p>

                      {member.issue_date && (
                        <p className="mt-2 text-sm text-gray-600">
                          Issued: {member.issue_date}
                        </p>
                      )}

                      {member.expiry_date && (
                        <p className="text-sm text-gray-600">
                          Expires: {member.expiry_date}
                        </p>
                      )}

                      <div className="mt-4 rounded-2xl bg-gray-100 p-4">
                        <p className="text-sm font-bold uppercase text-gray-500">
                          Payment
                        </p>

                        <p
                          className={`font-black ${
                            member.payment_status === "Paid"
                              ? "text-green-700"
                              : member.payment_status === "Not Required"
                              ? "text-gray-700"
                              : "text-red-600"
                          }`}
                        >
                          {member.payment_status || "Unpaid"}
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          Amount: ${member.payment_amount || 0}
                        </p>

                        {member.payment_method && (
                          <p className="text-sm text-gray-700">
                            Method: {member.payment_method}
                          </p>
                        )}

                        {member.payment_date && (
                          <p className="text-sm text-gray-700">
                            Paid:{" "}
                            {new Date(member.payment_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      {member.status === "Pending" && (
                        <>
                          <button
                            onClick={() => approveMember(member)}
                            className="rounded-xl bg-gray-950 px-6 py-4 font-bold text-white hover:bg-gray-800"
                          >
                            Approve & Generate ID
                          </button>

                          <button
                            onClick={() => rejectMember(member)}
                            className="rounded-xl bg-red-600 px-6 py-4 font-bold text-white hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {member.payment_status !== "Paid" &&
                      member.payment_status !== "Not Required" ? (
                        <button
                          onClick={() => markPaid(member)}
                          className="rounded-xl bg-green-600 px-6 py-4 font-bold text-white hover:bg-green-700"
                        >
                          Mark Paid
                        </button>
                      ) : (
                        member.payment_status === "Paid" && (
                          <button
                            onClick={() => markUnpaid(member)}
                            className="rounded-xl bg-orange-500 px-6 py-4 font-bold text-white hover:bg-orange-600"
                          >
                            Mark Unpaid
                          </button>
                        )
                      )}

                      {member.member_id &&
                        member.member_id.startsWith("USBC-") && (
                          <>
                            <button
                              onClick={() => renewMember(member)}
                              className="rounded-xl bg-green-700 px-6 py-4 font-bold text-white hover:bg-green-800"
                            >
                              Renew Membership
                            </button>

                            <a
                              href={`/member-card/${member.member_id}`}
                              target="_blank"
                              className="rounded-xl bg-gray-100 px-6 py-4 text-center font-bold text-gray-800 hover:bg-gray-200"
                            >
                              View Card
                            </a>
                          </>
                        )}

                      <button
                        onClick={() => startEdit(member)}
                        className="rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black hover:bg-yellow-300"
                      >
                        Edit Member
                      </button>

                      <button
                        onClick={() => deleteMember(member)}
                        className="rounded-xl bg-red-700 px-6 py-4 font-bold text-white hover:bg-red-800"
                      >
                        Delete Member
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    <h2 className="text-2xl font-black text-gray-950">
                      Edit Member Details
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        name="first_name"
                        value={editForm.first_name}
                        onChange={handleEditChange}
                        placeholder="First Name"
                        className="rounded-xl border px-4 py-4 text-gray-950"
                      />

                      <input
                        name="last_name"
                        value={editForm.last_name}
                        onChange={handleEditChange}
                        placeholder="Last Name"
                        className="rounded-xl border px-4 py-4 text-gray-950"
                      />

                      <input
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        placeholder="Email"
                        className="rounded-xl border px-4 py-4 text-gray-950"
                      />

                      <input
                        name="phone"
                        value={editForm.phone}
                        onChange={handleEditChange}
                        placeholder="Phone"
                        className="rounded-xl border px-4 py-4 text-gray-950"
                      />

                      <input
                        name="address"
                        value={editForm.address}
                        onChange={handleEditChange}
                        placeholder="Address"
                        className="rounded-xl border px-4 py-4 text-gray-950"
                      />

                      <input
                        name="emergency_contact"
                        value={editForm.emergency_contact}
                        onChange={handleEditChange}
                        placeholder="Emergency Contact"
                        className="rounded-xl border px-4 py-4 text-gray-950"
                      />

                      <select
                        name="membership_type"
                        value={editForm.membership_type}
                        onChange={handleEditChange}
                        className="rounded-xl border px-4 py-4 text-gray-950"
                      >
                        <option>Adults - $50</option>
                        <option>Student Member - $30</option>
                        <option>Corporate / Partner - $200</option>
                        <option>Honorary - $0</option>
                      </select>

                      <select
                        name="member_category"
                        value={editForm.member_category}
                        onChange={handleEditChange}
                        className="rounded-xl border px-4 py-4 text-gray-950"
                      >
                        <option>General Member</option>
                        <option>Executive Committee</option>
                        <option>Board of Trustees</option>
                        <option>Honorary Member</option>
                        <option>Corporate Partner</option>
                        <option>Student Member</option>
                      </select>

                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditChange}
                        className="rounded-xl border px-4 py-4 text-gray-950"
                      >
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                        <option>Expired</option>
                      </select>

                      <input
                        type="date"
                        name="issue_date"
                        value={editForm.issue_date}
                        onChange={handleEditChange}
                        className="rounded-xl border px-4 py-4 text-gray-950"
                      />

                      <input
                        type="date"
                        name="expiry_date"
                        value={editForm.expiry_date}
                        onChange={handleEditChange}
                        className="rounded-xl border px-4 py-4 text-gray-950"
                      />
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row">
                      <button
                        onClick={() => saveEdit(member)}
                        className="rounded-xl bg-gray-950 px-6 py-4 font-bold text-white hover:bg-gray-800"
                      >
                        Save Changes
                      </button>

                      <button
                        onClick={cancelEdit}
                        className="rounded-xl bg-gray-200 px-6 py-4 font-bold text-gray-800 hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredMembers.length === 0 && (
          <p className="rounded-3xl bg-white p-8 text-center font-bold text-gray-700">
            No matching members found.
          </p>
        )}
      </div>
    </main>
  );
}