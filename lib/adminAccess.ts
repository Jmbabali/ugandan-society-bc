export type AdminRole =
  | "super_admin"
  | "president"
  | "vice_president"
  | "pro"
  | "secretary"
  | "treasurer"
  | "events"
  | "fundraising";

export const roleLabels: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  president: "President",
  vice_president: "Vice President",
  pro: "PRO",
  secretary: "Secretary",
  treasurer: "Treasurer",
  events: "Events Coordinator",
  fundraising: "Fundraising Coordinator",
};

export const permissions: Record<AdminRole, string[]> = {
  super_admin: ["all"],

president: [
  "dashboard",
  "members",
  "events_registrations",
  "events",
  "email",
  "renewals",
  "businesses",
  "gallery",
  "updates",
  "donations",
  "payments",
],

vice_president: [
  "dashboard",
  "members",
   "events_registrations",
  "events",
  "email",
  "renewals",
  "businesses",
  "gallery",
  "updates",
  "donations",
  "payments",
],
  pro: [
  "dashboard",
  "members",
  "events",
  "event_registrations",
  "email",
  "businesses",
  "gallery",
  "updates",
],

  secretary: ["dashboard", "members", "renewals"],

  treasurer: [
    "dashboard",
    "payments",
    "members",
    "renewals",
    "donations",
  ],

  events: ["dashboard", "events", "event_registrations"],

  fundraising: ["dashboard", "donations"],
};

export function getAdminRole(): AdminRole {
  if (typeof window === "undefined") return "super_admin";

  return (
    (localStorage.getItem("usbc_admin_role") as AdminRole) || "super_admin"
  );
}

export function canAccess(role: AdminRole, section: string) {
  if (permissions[role]?.includes("all")) return true;
  return permissions[role]?.includes(section);
}