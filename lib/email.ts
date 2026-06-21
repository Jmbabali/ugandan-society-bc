import emailjs from "@emailjs/browser";

export const EMAILJS_SERVICE_ID = "service_ubqt8tr";
export const EMAILJS_APPROVAL_TEMPLATE_ID = "template_h267e0h";
export const EMAILJS_PUBLIC_KEY = "5fuwosM5RJCHTr9v2";

export async function sendApprovalEmail({
  toEmail,
  memberName,
  memberId,
  issueDate,
  expiryDate,
  cardLink,
}: {
  toEmail: string;
  memberName: string;
  memberId: string;
  issueDate: string;
  expiryDate: string;
  cardLink: string;
}) {
  return emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_APPROVAL_TEMPLATE_ID,
    {
      to_email: toEmail,
      member_name: memberName,
      member_id: memberId,
      issue_date: issueDate,
      expiry_date: expiryDate,
      card_link: cardLink,
    },
    EMAILJS_PUBLIC_KEY
  );
}