import { useRef, useState } from "react";
import Phone, { type Screen, type Filter, type Actions } from "./Phone";
import { CATEGORY_META, INITIAL_SUBS, inr, type Subscription } from "./data";
import * as I from "./icons";

export type PushNotif = { key: number; title: string; body: string };

/* ───────────────── demo state ───────────────── */

function useDemo() {
  const [subs, setSubs] = useState<Subscription[]>(INITIAL_SUBS);
  const [screen, setScreen] = useState<Screen>("home");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [notif, setNotif] = useState<PushNotif | null>(null);
  const notifTimer = useRef<number | null>(null);

  const update = (id: string, patch: Partial<Subscription>, timelineText?: string, actor = "You") => {
    setSubs((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const next = { ...s, ...patch };
        if (timelineText) {
          next.timeline = [
            ...s.timeline,
            { id: `t${s.timeline.length + 1}`, time: "Just now", actor, text: timelineText },
          ];
        }
        return next;
      })
    );
  };

  const pushNotify = (title: string, body: string) => {
    if (notifTimer.current) window.clearTimeout(notifTimer.current);
    setNotif({ key: Date.now(), title, body });
    notifTimer.current = window.setTimeout(() => setNotif(null), 6500);
  };

  const actions: Actions = {
    onNavigate: (s, id) => { setScreen(s); if (id) setActiveId(id); },
    onFilterChange: setFilter,
    onNudge: (id) => update(id, { nudged: true }, "WhatsApp nudge sent (auto-filled via WhatsApp Business API).", "You"),
    onSimulate: (id) => {
      const sub = subs.find((s) => s.id === id)!;
      update(id, { status: "ready", cardUpdated: true }, CATEGORY_META[sub.category].simDoneText, "System");
      pushNotify(
        `Razorpay · ${sub.customer.split(" ")[0]} is ready to charge`,
        `${CATEGORY_META[sub.category].simDoneText} Collect ${inr(sub.mrr)} any time — no need to check the app.`
      );
    },
    onCharge: (id) => {
      const sub = subs.find((s) => s.id === id)!;
      update(id, { status: "recovered" }, `Charged ${inr(sub.mrr)} — recovered.`, "You");
    },
  };

  const reset = () => {
    setSubs(INITIAL_SUBS); setScreen("home"); setActiveId(null); setFilter("all");
    setNotif(null);
    if (notifTimer.current) window.clearTimeout(notifTimer.current);
  };

  return { subs, screen, activeId, filter, actions, reset, notif };
}

function Restart({ onClick }: { onClick: () => void }) {
  return (
    <button className="restart" onClick={onClick}>
      <I.Reset s={13} />Reset demo
    </button>
  );
}

/* ───────────────── page ───────────────── */

export default function App() {
  const d = useDemo();
  const needsAction = d.subs.filter((s) => s.status === "halted" || s.status === "ready").length;
  const recovered = d.subs.filter((s) => s.status === "recovered").length;

  const cue = screenCue(d.screen, d.activeId, d.subs);

  return (
    <>
      <header className="hero" style={{ padding: "64px 0 36px", textAlign: "center" }}>
        <div className="wrap">
          <div className="hero-badge" style={{ justifyContent: "center" }}>
            <span className="chip-track">TRACK 1</span>
            <span>Razorpay × ISB Build Challenge · <b>Razorpay in Your Pocket</b></span>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>Recovery Inbox</h1>
          <p className="lede" style={{ margin: "0 auto" }}>
            Failed subscription payments — expired cards, cancelled UPI mandates, low balance, bank declines — surfaced the moment they're fixable, and fast-tracked to a recovered charge in one tap.
          </p>
          <div className="legend-row">
            <div className="legend-item"><span className="legend-num">1</span>System flags it — the fix depends on why it failed</div>
            <div className="legend-item"><span className="legend-num">2</span>Merchant taps once to send an auto-filled WhatsApp nudge</div>
            <div className="legend-item"><span className="legend-num">3</span>App detects the fix, charges in one tap</div>
          </div>
        </div>
      </header>

      <section className="section section--tight" id="demo">
        <div className="wrap">
          <div className="stage" style={{ borderColor: "rgba(51,149,255,0.28)" }}>
            <div className="stage-head">
              <div className="stage-title">
                <span className="stage-dot" style={{ background: "var(--rz)" }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em" }}>Recovery Inbox</div>
                  <div className="small" style={{ color: "var(--tx-3)" }}>Tap through a halted subscription</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span className="interactive-chip">👆 Tap to play</span>
                <span className="meter ok"><I.Bolt s={13} c="#5FE0A8" />{needsAction} to act on · {recovered} recovered</span>
              </div>
            </div>
            <div className="stage-body">
              <div className="phones">
                <div className="phone-col">
                  <div className="phone-frame">
                    {d.notif && (
                      <div className="push-notif" key={d.notif.key}>
                        <div className="push-notif-ic"><I.Bolt s={13} c="#fff" /></div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="push-notif-top">
                            <span className="push-notif-app">RAZORPAY</span>
                            <span className="push-notif-now">now</span>
                          </div>
                          <div className="push-notif-title">{d.notif.title}</div>
                          <div className="push-notif-body">{d.notif.body}</div>
                        </div>
                      </div>
                    )}
                    <Phone
                      screen={d.screen}
                      subs={d.subs}
                      activeId={d.activeId}
                      filter={d.filter}
                      actions={d.actions}
                    />
                  </div>
                </div>
              </div>
              <div className="caption">{cue}</div>
              <div className="tap-row">
                <div className="step-label">{screenLabel(d.screen)}</div>
                <Restart onClick={d.reset} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          <div style={{ fontWeight: 700, color: "var(--tx)", fontSize: 14 }}>
            Recovery Inbox — Track 1, Razorpay × ISB Build Challenge
          </div>
          <div className="src">
            Interactive wireframe · synthetic subscriptions · deterministic rules on mock data, 2026.
          </div>
        </div>
      </footer>
    </>
  );
}

function screenLabel(s: Screen) {
  switch (s) {
    case "home": return "MERCHANT HOME";
    case "inbox": return "RECOVERY INBOX";
    case "detail": return "SUBSCRIPTION DETAIL";
    case "owner": return "OVERVIEW";
  }
}

function screenCue(s: Screen, activeId: string | null, subs: Subscription[]) {
  if (s === "home") return "👆 Tap “Recovery Inbox” — the merchant's single queue of money stuck in limbo";
  if (s === "inbox") return "👆 Tap the top case — it still needs a nudge sent";
  if (s === "owner") return "The owner's live view — every recovered rupee shows up here instantly";
  const sub = subs.find((x) => x.id === activeId);
  if (!sub) return "👆 Work the case, step by step — the tracker above shows exactly where you are";
  if (sub.status === "recovered") return "✅ Recovered, fully logged — back to Inbox to try the next case";
  if (sub.status === "auto_retry") return "Razorpay is still auto-retrying this one — the app hides it from your to-do list until it needs you";
  if (sub.status === "ready") return "👆 Fixed on their end, but Razorpay still won't charge it on its own — tap to collect it";
  if (!sub.nudged) return "👆 Razorpay already has their phone number — review the auto-filled WhatsApp message and tap send";
  return "👆 In real life this is the customer tapping the link. Tap the demo control to play that out";
}
