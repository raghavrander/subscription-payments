export type SubStatus = "auto_retry" | "halted" | "ready" | "recovered";

export type FailureCategory = "card_expired" | "insufficient_balance" | "mandate_cancelled" | "bank_declined";

export type TimelineEvent = {
  id: string;
  time: string;
  actor: string;
  text: string;
};

export type Subscription = {
  id: string;
  customer: string;
  phone: string;
  plan: string;
  mrr: number;
  status: SubStatus;
  category: FailureCategory;
  daysSince: number;
  nudged: boolean;
  cardUpdated: boolean;
  timeline: TimelineEvent[];
};

export const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

/* ── per-failure-type content ──
   Real recurring-payment failures aren't all "card expired" — Razorpay's own
   retry docs and UPI AutoPay error data show at least four distinct shapes,
   each with a different fix (not just "update your card"). */
export const CATEGORY_META: Record<
  FailureCategory,
  {
    label: string;
    icon: "card" | "wallet" | "swap" | "bank";
    stepLabel: string;
    why: string;
    simLabel: string;
    simDoneText: string;
    chargeLabel: string;
    nudge: (s: { customer: string; plan: string; mrr: number }) => string;
  }
> = {
  card_expired: {
    label: "Card expired",
    icon: "card",
    stepLabel: "Card updated",
    why: "Razorpay creates the next invoice once the card's updated, but won't auto-charge it — someone still has to collect it.",
    simLabel: "👆 Simulate: customer updated card →",
    simDoneText: "Customer updated card via link.",
    chargeLabel: "Charge now",
    nudge: (s) => `Hi ${s.customer.split(" ")[0]}, the card on file for your ${s.plan} plan (${inr(s.mrr)}/mo) has expired. Update it here to keep your subscription active — takes 30 seconds: {update_link}`,
  },
  insufficient_balance: {
    label: "Insufficient balance",
    icon: "wallet",
    stepLabel: "Funds confirmed",
    why: "Razorpay retried this charge for 3 days straight and gave up — it won't keep trying forever, or silently retry once money's back in the account.",
    simLabel: "👆 Simulate: customer confirmed funds available →",
    simDoneText: "Customer confirmed funds are available.",
    chargeLabel: "Retry charge now",
    nudge: (s) => `Hi ${s.customer.split(" ")[0]}, we couldn't collect ${inr(s.mrr)} for your ${s.plan} plan — your account balance was too low. We'll retry as soon as you confirm funds are ready: {update_link}`,
  },
  mandate_cancelled: {
    label: "UPI AutoPay cancelled",
    icon: "swap",
    stepLabel: "Mandate re-set up",
    why: "The customer cancelled AutoPay from their bank app — there's no card to \"update\" here; they have to set up the mandate again from scratch.",
    simLabel: "👆 Simulate: customer re-authorized UPI AutoPay →",
    simDoneText: "Customer re-authorized UPI AutoPay mandate.",
    chargeLabel: "Charge now",
    nudge: (s) => `Hi ${s.customer.split(" ")[0]}, your UPI AutoPay for ${s.plan} (${inr(s.mrr)}/mo) was cancelled from your bank. Set it up again here so you don't lose access: {update_link}`,
  },
  bank_declined: {
    label: "Bank blocked the card",
    icon: "bank",
    stepLabel: "New method added",
    why: "The issuing bank itself is declining this card for the renewal — updating the expiry won't fix it; the customer needs to pay with a different method.",
    simLabel: "👆 Simulate: customer added a new payment method →",
    simDoneText: "Customer added a new payment method.",
    chargeLabel: "Charge now",
    nudge: (s) => `Hi ${s.customer.split(" ")[0]}, your bank declined the renewal charge for ${s.plan}. Add a different payment method here to keep your subscription active: {update_link}`,
  },
};

export const INITIAL_SUBS: Subscription[] = [
  {
    id: "rohan",
    customer: "Rohan Verma",
    phone: "+91 98100 22341",
    plan: "Pro · Monthly",
    mrr: 999,
    status: "halted",
    category: "card_expired",
    daysSince: 3,
    nudged: false,
    cardUpdated: false,
    timeline: [
      { id: "t1", time: "3 days ago", actor: "System", text: "Renewal failed — card expired." },
      { id: "t2", time: "3 days ago", actor: "System", text: "Retries exhausted. Subscription halted." },
    ],
  },
  {
    id: "amit",
    customer: "Amit Shah",
    phone: "+91 90040 11287",
    plan: "Pro · Monthly",
    mrr: 499,
    status: "halted",
    category: "mandate_cancelled",
    daysSince: 6,
    nudged: true,
    cardUpdated: false,
    timeline: [
      { id: "t1", time: "6 days ago", actor: "System", text: "Renewal failed — UPI AutoPay mandate cancelled by customer." },
      { id: "t2", time: "6 days ago", actor: "System", text: "No active mandate. Subscription halted." },
      { id: "t3", time: "5 days ago", actor: "You", text: "WhatsApp nudge sent (auto-filled via WhatsApp Business API)." },
    ],
  },
  {
    id: "karan",
    customer: "Karan Mehta",
    phone: "+91 97170 55402",
    plan: "Growth · Monthly",
    mrr: 1499,
    status: "ready",
    category: "bank_declined",
    daysSince: 2,
    nudged: true,
    cardUpdated: true,
    timeline: [
      { id: "t1", time: "2 days ago", actor: "System", text: "Renewal failed — issuing bank declined the card." },
      { id: "t2", time: "2 days ago", actor: "You", text: "WhatsApp nudge sent (auto-filled via WhatsApp Business API)." },
      { id: "t3", time: "4 hours ago", actor: "System", text: "Customer added a new payment method." },
    ],
  },
  {
    id: "priya",
    customer: "Priya Nair",
    phone: "+91 98211 76630",
    plan: "Growth · Monthly",
    mrr: 1499,
    status: "auto_retry",
    category: "insufficient_balance",
    daysSince: 1,
    nudged: false,
    cardUpdated: false,
    timeline: [
      { id: "t1", time: "Today", actor: "System", text: "Renewal failed — insufficient balance. Retrying automatically." },
    ],
  },
  {
    id: "sana",
    customer: "Sana Iqbal",
    phone: "+91 99530 08817",
    plan: "Pro · Monthly",
    mrr: 999,
    status: "recovered",
    category: "card_expired",
    daysSince: 0,
    nudged: true,
    cardUpdated: true,
    timeline: [
      { id: "t1", time: "Yesterday", actor: "System", text: "Renewal failed — card expired." },
      { id: "t2", time: "Yesterday", actor: "You", text: "WhatsApp nudge sent (auto-filled via WhatsApp Business API)." },
      { id: "t3", time: "Today, 9:02 AM", actor: "System", text: "Customer updated card via link." },
      { id: "t4", time: "Today, 9:03 AM", actor: "You", text: "Charged ₹999 — recovered." },
    ],
  },
];
