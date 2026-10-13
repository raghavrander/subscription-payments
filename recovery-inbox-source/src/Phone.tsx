import { Fragment } from "react";
import { CATEGORY_META, inr, type FailureCategory, type Subscription, type SubStatus } from "./data";
import * as I from "./icons";

const REASON_ICONS = { card: I.CardIc, wallet: I.Wallet, swap: I.Swap, bank: I.Bank };
const ReasonIcon = ({ cat, s = 11 }: { cat: FailureCategory; s?: number }) => {
  const Icon = REASON_ICONS[CATEGORY_META[cat].icon];
  return <Icon s={s} />;
};

export type Screen = "home" | "inbox" | "detail" | "owner";
export type Filter = "all" | "action" | "auto";

const StatusBar = ({ ink }: { ink?: boolean }) => (
  <div className={"statusbar" + (ink ? " statusbar--ink" : "")}>
    <span>9:41</span>
    <span className="sb-icons"><I.Signal /><I.Wifi /><I.Batt /></span>
  </div>
);

const Nav = ({ on, inboxCount, onNav }: { on: Screen; inboxCount: number; onNav: (s: Screen) => void }) => (
  <div className="rz-nav">
    {[
      { k: "home" as Screen, l: "Home", I: I.Home, nav: true },
      { k: "inbox" as Screen, l: "Inbox", I: I.Radar, nav: true, badge: inboxCount },
      { k: "owner" as Screen, l: "Overview", I: I.Shield, nav: true },
      { k: "sup" as const, l: "Support", I: I.Help, nav: false },
      { k: "acc" as const, l: "Account", I: I.User, nav: false },
    ].map((n) => (
      <div
        key={n.k}
        className={"rz-nav-i" + (on === n.k ? " on" : "") + (n.nav ? " tap" : "")}
        onClick={n.nav ? () => onNav(n.k as Screen) : undefined}
        style={{ position: "relative" }}
      >
        {"badge" in n && n.badge ? <span className="nav-badge">{n.badge}</span> : null}
        <n.I s={17} /><span>{n.l}</span>
      </div>
    ))}
  </div>
);

const AppBar = ({ t, s, onBack, right }: { t: string; s?: string; onBack?: () => void; right?: React.ReactNode }) => (
  <div className="rz-appbar">
    <div className={"ic-btn" + (onBack ? " tap" : "")} onClick={onBack}><I.Back s={18} /></div>
    <div style={{ flex: 1 }}>
      <div className="rz-appbar-t">{t}</div>
      {s && <div className="rz-appbar-s">{s}</div>}
    </div>
    {right}
  </div>
);

const SubBadge = ({ status }: { status: SubStatus }) => {
  const m: Record<SubStatus, { l: string; cls: string }> = {
    auto_retry: { l: "Auto-retrying", cls: "b-ref" },
    halted: { l: "Halted", cls: "b-bad" },
    ready: { l: "Ready to charge", cls: "b-ok" },
    recovered: { l: "Recovered", cls: "b-ok" },
  };
  const x = m[status];
  return <span className={"rz-badge " + x.cls}>{x.l}</span>;
};

const Initials = ({ n }: { n: string }) => (
  <div className="rz-txn-ic">{n.split(" ").map((x) => x[0]).join("").slice(0, 2)}</div>
);

export type Actions = {
  onNavigate: (screen: Screen, id?: string) => void;
  onFilterChange: (f: Filter) => void;
  onNudge: (id: string) => void;
  onSimulate: (id: string) => void;
  onCharge: (id: string) => void;
};

export default function Phone({
  screen, subs, activeId, filter, actions, dim,
}: {
  screen: Screen;
  subs: Subscription[];
  activeId: string | null;
  filter: Filter;
  actions: Actions;
  dim?: boolean;
}) {
  const needsAction = subs.filter((s) => s.status === "halted" || s.status === "ready");
  const inboxCount = needsAction.length;

  let body: React.ReactNode;
  if (screen === "home") body = <HomeScreen subs={subs} actions={actions} />;
  else if (screen === "inbox") body = <InboxScreen subs={subs} filter={filter} actions={actions} />;
  else if (screen === "owner") body = <OwnerScreen subs={subs} actions={actions} />;
  else {
    const sub = subs.find((s) => s.id === activeId) ?? subs[0];
    body = <DetailScreen key={sub.id} sub={sub} actions={actions} />;
  }

  return (
    <div className={"phone" + (dim ? " phone--dim" : "")}>
      <div className="notch" />
      <div className="phone-screen">
        {body}
        {screen !== "detail" && <Nav on={screen} inboxCount={inboxCount} onNav={(s) => actions.onNavigate(s)} />}
      </div>
    </div>
  );
}

/* ───────────────── Home ───────────────── */

function HomeScreen({ subs, actions }: { subs: Subscription[]; actions: Actions }) {
  const needsAction = subs.filter((s) => s.status === "halted" || s.status === "ready");
  const ready = needsAction.filter((s) => s.status === "ready").length;
  const atRisk = needsAction.reduce((a, s) => a + s.mrr, 0);
  const recoveredToday = subs.filter((s) => s.status === "recovered");

  return (
    <div className="screen-scroll">
      <div className="rz-home-top">
        <StatusBar ink />
        <div className="rz-user">
          <div className="rz-avatar">GS</div>
          <div>
            <div className="rz-greet">Good morning</div>
            <div className="rz-biz">GLOWSKIN NATURALS</div>
          </div>
        </div>
        <div className="rz-bal-l">MRR at risk right now</div>
        <div className="rz-bal" style={{ fontSize: 22 }}>{inr(atRisk)}</div>
      </div>
      <div className="rz-body">
        {needsAction.length > 0 && <div className="tap-hint">👇 Start here</div>}
        <div
          className={"radar-entry" + (needsAction.length ? " tap pulse" : "")}
          onClick={() => actions.onNavigate("inbox")}
        >
          <div className="radar-entry-ic"><I.Radar s={20} c="#fff" /></div>
          <div style={{ flex: 1 }}>
            <div className="radar-entry-t">👆 Recovery Inbox</div>
            <div className="radar-entry-s">{needsAction.length} case{needsAction.length === 1 ? "" : "s"} need action</div>
          </div>
          {ready > 0 && <span className="radar-entry-badge">{ready} ready</span>}
        </div>

        <div className="lbl" style={{ marginTop: 18 }}>Today</div>
        <div className="stat-row">
          <div className="stat-tile">
            <div className="stat-tile-k" style={{ color: "var(--ok)" }}>{recoveredToday.length}</div>
            <div className="stat-tile-l">Recovered · {inr(recoveredToday.reduce((a, s) => a + s.mrr, 0))}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-k" style={{ color: "var(--warn)" }}>{needsAction.length}</div>
            <div className="stat-tile-l">Awaiting action</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── Inbox ───────────────── */

const FILTERS: { k: Filter; l: string }[] = [
  { k: "all", l: "All" },
  { k: "action", l: "Needs action" },
  { k: "auto", l: "Auto-retrying" },
];

function InboxScreen({ subs, filter, actions }: { subs: Subscription[]; filter: Filter; actions: Actions }) {
  const live = subs.filter((s) => s.status !== "recovered");
  const filtered = live.filter((s) => {
    if (filter === "action") return s.status === "halted" || s.status === "ready";
    if (filter === "auto") return s.status === "auto_retry";
    return true;
  });
  const sorted = [...filtered].sort((a, b) => rank(a) - rank(b));

  return (
    <>
      <StatusBar />
      <AppBar t="Recovery Inbox" s={`${live.filter((s) => s.status !== "auto_retry").length} need action`} onBack={() => actions.onNavigate("home")} />
      <div className="filter-chips">
        {FILTERS.map((f) => (
          <span
            key={f.k}
            className={"rchip tap" + (filter === f.k ? " on" : "")}
            onClick={() => actions.onFilterChange(f.k)}
          >
            {f.l}
          </span>
        ))}
      </div>
      <div className="screen-scroll pad" style={{ background: "var(--app-bg)", paddingTop: 10 }}>
        {sorted.length === 0 && (
          <div className="notice info"><I.CheckC s={14} /><div>Nothing in this filter.</div></div>
        )}
        {sorted.map((s, i) => {
          const actionable = s.status === "halted" || s.status === "ready";
          return (
            <div
              key={s.id}
              className={"exc-card tap" + (actionable ? " critical" : "")}
              onClick={() => actions.onNavigate("detail", s.id)}
            >
              <div className="exc-row">
                <div className="priority-badge">{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div className="exc-top">
                    <span className="exc-ref">{s.customer} · {inr(s.mrr)}/mo</span>
                    <SubBadge status={s.status} />
                  </div>
                  <div className="exc-ful">{s.plan}</div>
                  <div className="exc-reason">
                    <span className="reason-ic-badge"><ReasonIcon cat={s.category} s={10} /></span>
                    {CATEGORY_META[s.category].label}
                  </div>
                  <div className="exc-bottom">
                    <span className={"assignee-chip" + (s.status === "auto_retry" ? "" : " unowned")}>
                      {s.status === "auto_retry" ? "System handling" : s.nudged ? "Nudge sent" : "⚠ No action yet"}
                    </span>
                    <span className="exc-elapsed"><I.Clock s={11} />{s.daysSince}d</span>
                  </div>
                </div>
                <span className="card-chev"><I.Chev s={13} /></span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function rank(s: Subscription) {
  if (s.status === "halted" && !s.nudged) return 0;
  if (s.status === "halted") return 1;
  if (s.status === "ready") return 2;
  return 3;
}

/* ───────────────── Detail ───────────────── */

function Stepper({ sub }: { sub: Subscription }) {
  const steps = [
    { l: "Flagged" },
    { l: "Nudged" },
    { l: CATEGORY_META[sub.category].stepLabel },
    { l: "Charged" },
  ];
  const done = [
    true,
    sub.nudged,
    sub.status === "ready" || sub.status === "recovered",
    sub.status === "recovered",
  ];
  const currentIdx = done.findIndex((d) => !d);

  return (
    <div className="step-track">
      {steps.map((s, i) => (
        <Fragment key={s.l + i}>
          <div className="step-dot-wrap">
            <div className={"step-circle" + (done[i] ? " done" : i === currentIdx ? " current" : "")}>
              {done[i] ? <I.Check s={10} c="#fff" w={3} /> : i + 1}
            </div>
            <div className={"step-label-sm" + (done[i] ? " done" : "")}>{s.l}</div>
          </div>
          {i < steps.length - 1 && <div className={"step-line" + (done[i] ? " done" : "")} />}
        </Fragment>
      ))}
    </div>
  );
}

/* ───────────────── WhatsApp nudge (auto-filled, not typed) ───────────────── */

function WhatsAppNudge({ sub, onSend }: { sub: Subscription; onSend: () => void }) {
  const meta = CATEGORY_META[sub.category];
  const msg = meta.nudge(sub).replace("{update_link}", "rzp.io/i/aB3xK9");

  return (
    <div className="wa-card">
      <div className="wa-head">
        <I.Send s={11} c="#128C7E" />WHATSAPP BUSINESS API
        <span className="wa-auto">📱 Auto-filled from customer record</span>
      </div>
      <div className="wa-to">To <b>{sub.customer}</b> · {sub.phone}</div>
      <div className="wa-bubble">{msg}</div>
      {!sub.nudged ? (
        <div className="wa-send-wrap">
          <div className="tap-hint" style={{ marginTop: 0 }}>👇 Nothing to type — just review &amp; send</div>
          <button className="btn-rz tap pulse" onClick={onSend}>
            <I.Send s={13} />👆 Send via WhatsApp
          </button>
        </div>
      ) : (
        <div className="wa-sent"><I.CheckC s={12} c="#128C7E" />Delivered to {sub.phone} <span className="wa-ticks">✓✓</span></div>
      )}
    </div>
  );
}

function DetailScreen({ sub, actions }: { sub: Subscription; actions: Actions }) {
  return (
    <>
      <StatusBar />
      <AppBar t={sub.customer} s={sub.plan} onBack={() => actions.onNavigate("inbox")} />
      <div className="screen-scroll pad" style={{ background: "var(--app-bg)" }}>
        {sub.status !== "auto_retry" && <Stepper sub={sub} />}

        <div className="w-card status-split">
          <div className="status-half">
            <div className="lbl">Status</div>
            <SubBadge status={sub.status} />
            <div className="status-amt">{inr(sub.mrr)}<span style={{ fontSize: 11, fontWeight: 600, color: "var(--app-mut)" }}>/mo</span></div>
          </div>
          <div className="status-div" />
          <div className="status-half">
            <div className="lbl">Reason</div>
            <span className="rz-badge b-ref" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <ReasonIcon cat={sub.category} s={9} />{CATEGORY_META[sub.category].label}
            </span>
            <div className="status-amt-s">{sub.daysSince}d since failure</div>
            {(sub.status === "halted" || sub.status === "ready") && (
              <div className="why-line">↳ <b>Not a one-size-fix:</b> {CATEGORY_META[sub.category].why}</div>
            )}
          </div>
        </div>

        <div className="lbl" style={{ marginTop: 16 }}>Timeline</div>
        <div className="w-card timeline" style={{ padding: 0, overflow: "hidden" }}>
          {sub.timeline.map((t, i) => (
            <div key={t.id} className="timeline-item" style={{ borderBottom: i < sub.timeline.length - 1 ? "1px solid var(--app-line)" : 0 }}>
              <div className="timeline-dot" style={t.actor === "System" ? { background: "var(--app-mut)" } : undefined} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, fontWeight: 650 }}>{t.actor} <span style={{ color: "var(--app-mut)", fontWeight: 450 }}>· {t.time}</span></div>
                <div className="rz-txn-sub" style={{ marginTop: 1, whiteSpace: "normal" }}>{t.text}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          {sub.status === "auto_retry" && (
            <div className="notice info"><I.Clock s={14} /><div>System is retrying automatically. No action needed.</div></div>
          )}

          {sub.status === "halted" && (
            <>
              <WhatsAppNudge sub={sub} onSend={() => actions.onNudge(sub.id)} />

              {sub.nudged && <div className="tap-hint" style={{ marginTop: 12 }}>👇 Now try this</div>}
              <div className="sim-box">
                <div className="sim-lbl"><I.Gear s={11} />Demo control — plays the customer's side</div>
                <span className="rchip tap sim-chip" onClick={() => actions.onSimulate(sub.id)}>
                  {CATEGORY_META[sub.category].simLabel}
                </span>
              </div>
            </>
          )}

          {sub.status === "ready" && (
            <>
              <div className="tap-hint">👇 Fixed on their end — collect the payment</div>
              <button className="btn-rz ok tap pulse" onClick={() => actions.onCharge(sub.id)}>
                <I.Bolt s={14} c="#fff" />👆 {CATEGORY_META[sub.category].chargeLabel} — {inr(sub.mrr)}
              </button>
            </>
          )}

          {sub.status === "recovered" && (
            <div className="notice ok"><I.CheckC s={14} /><div><b>Recovered.</b> {inr(sub.mrr)} charged.</div></div>
          )}
        </div>
      </div>
    </>
  );
}

/* ───────────────── Overview ───────────────── */

function OwnerScreen({ subs, actions }: { subs: Subscription[]; actions: Actions }) {
  const needsAction = subs.filter((s) => s.status === "halted" || s.status === "ready");
  const atRisk = needsAction.reduce((a, s) => a + s.mrr, 0);
  const recovered = subs.filter((s) => s.status === "recovered");

  return (
    <>
      <StatusBar />
      <AppBar t="Overview" s="Live" onBack={() => actions.onNavigate("home")} />
      <div className="screen-scroll pad" style={{ background: "var(--app-bg)" }}>
        <div className="stat-row">
          <div className="stat-tile">
            <div className="stat-tile-k">{needsAction.length}</div>
            <div className="stat-tile-l">Need action</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-k" style={{ color: "var(--warn)" }}>{inr(atRisk)}</div>
            <div className="stat-tile-l">MRR at risk</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-k" style={{ color: "var(--ok)" }}>{recovered.length}</div>
            <div className="stat-tile-l">Recovered today</div>
          </div>
        </div>

        <div className="lbl" style={{ marginTop: 16 }}>Recovered today</div>
        <div className="w-card" style={{ padding: 0, overflow: "hidden" }}>
          {recovered.length === 0 && (
            <div style={{ padding: 13, fontSize: 11.5, color: "var(--app-mut)" }}>Nothing recovered yet.</div>
          )}
          {recovered.map((s, i, arr) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 11, padding: 12, borderBottom: i < arr.length - 1 ? "1px solid var(--app-line)" : 0 }}>
              <Initials n={s.customer} />
              <div style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{s.customer}</div>
              <span className="rz-badge b-ok">+{inr(s.mrr)}</span>
            </div>
          ))}
        </div>

        <div className="lbl" style={{ marginTop: 16 }}>Needs action</div>
        {needsAction.length === 0 && <div className="notice ok"><I.CheckC s={14} /><div>Inbox clear.</div></div>}
        {needsAction.map((s) => (
          <div key={s.id} className="exc-card tap critical" onClick={() => actions.onNavigate("detail", s.id)}>
            <div className="exc-row">
              <div style={{ flex: 1 }}>
                <div className="exc-top">
                  <span className="exc-ref">{s.customer} · {inr(s.mrr)}/mo</span>
                  <SubBadge status={s.status} />
                </div>
                <div className="exc-bottom">
                  <span className="assignee-chip unowned">{s.nudged ? "Nudge sent" : "⚠ No action yet"}</span>
                  <span className="exc-elapsed"><I.Clock s={11} />{s.daysSince}d</span>
                </div>
              </div>
              <span className="card-chev"><I.Chev s={13} /></span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
