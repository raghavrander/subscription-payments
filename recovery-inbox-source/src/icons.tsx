type P = { s?: number; c?: string; w?: number };
const base = (s = 16, c = "currentColor", w = 1.9) => ({
  width: s, height: s, viewBox: "0 0 24 24", fill: "none",
  stroke: c, strokeWidth: w, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
});

export const Eye = ({ s, c }: P) => (<svg {...base(s, c)}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>);
export const Share = ({ s, c }: P) => (<svg {...base(s, c)}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></svg>);
export const QR = ({ s, c }: P) => (<svg {...base(s, c)}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3zM19 19h2M14 21h3" /></svg>);
export const Link = ({ s, c }: P) => (<svg {...base(s, c)}><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></svg>);
export const Page = ({ s, c }: P) => (<svg {...base(s, c)}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></svg>);
export const Grid = ({ s, c }: P) => (<svg {...base(s, c)}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>);
export const Bank = ({ s, c }: P) => (<svg {...base(s, c)}><path d="M3 10h18M5 10v9M19 10v9M9 10v9M15 10v9M2 21h20M12 2 3 7h18z" /></svg>);
export const Chev = ({ s, c }: P) => (<svg {...base(s, c)}><path d="m6 9 6 6 6-6" /></svg>);
export const Back = ({ s, c }: P) => (<svg {...base(s, c)}><path d="m15 18-6-6 6-6" /></svg>);
export const Home = ({ s, c }: P) => (<svg {...base(s, c)}><path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>);
export const Swap = ({ s, c }: P) => (<svg {...base(s, c)}><path d="M7 16H3m0 0 3-3m-3 3 3 3M17 8h4m0 0-3-3m3 3-3 3" /><path d="M3 16h14M21 8H7" /></svg>);
export const Help = ({ s, c }: P) => (<svg {...base(s, c)}><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" /></svg>);
export const User = ({ s, c }: P) => (<svg {...base(s, c)}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
export const Filter = ({ s, c }: P) => (<svg {...base(s, c)}><path d="M3 5h18M7 12h10M10 19h4" /></svg>);
export const Doc = ({ s, c }: P) => (<svg {...base(s, c)}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>);
export const Cal = ({ s, c }: P) => (<svg {...base(s, c)}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>);
export const Search = ({ s, c }: P) => (<svg {...base(s, c)}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>);
export const Check = ({ s, c, w }: P) => (<svg {...base(s, c, w)}><path d="M20 6 9 17l-5-5" /></svg>);
export const CheckC = ({ s, c }: P) => (<svg {...base(s, c)}><circle cx="12" cy="12" r="10" /><path d="m8.5 12 2.5 2.5L16 9.5" /></svg>);
export const X = ({ s, c }: P) => (<svg {...base(s, c)}><path d="M18 6 6 18M6 6l12 12" /></svg>);
export const XC = ({ s, c }: P) => (<svg {...base(s, c)}><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" /></svg>);
export const Clock = ({ s, c }: P) => (<svg {...base(s, c)}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>);
export const Alert = ({ s, c }: P) => (<svg {...base(s, c)}><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>);
export const Lock = ({ s, c }: P) => (<svg {...base(s, c)}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>);
export const Shield = ({ s, c }: P) => (<svg {...base(s, c)}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>);
export const Send = ({ s, c }: P) => (<svg {...base(s, c)}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z" /></svg>);
export const Img = ({ s, c }: P) => (<svg {...base(s, c)}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>);
export const Bell = ({ s, c }: P) => (<svg {...base(s, c)}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" /></svg>);
export const Play = ({ s, c }: P) => (<svg {...base(s, c)}><path d="m6 3 14 9-14 9z" fill="currentColor" /></svg>);
export const Pause = ({ s, c }: P) => (<svg {...base(s, c)}><path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor" /></svg>);
export const Reset = ({ s, c }: P) => (<svg {...base(s, c)}><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" /><path d="M3 3v5h5" /></svg>);
export const Arrow = ({ s, c }: P) => (<svg {...base(s, c)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const Wallet = ({ s, c }: P) => (<svg {...base(s, c)}><path d="M20 12V8H6a2 2 0 0 1 0-4h12v4" /><path d="M4 6v12a2 2 0 0 0 2 2h14v-4" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>);
export const Plus = ({ s, c }: P) => (<svg {...base(s, c)}><path d="M12 5v14M5 12h14" /></svg>);
export const Radar = ({ s, c }: P) => (<svg {...base(s, c)}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.3" fill={c ?? "currentColor"} stroke="none" /><path d="M12 3v2M21 12h-2M12 21v-2M3 12h2" /></svg>);
export const UserCheck = ({ s, c }: P) => (<svg {...base(s, c)}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="m17 11 2 2 4-4" /></svg>);
export const Handoff = ({ s, c }: P) => (<svg {...base(s, c)}><path d="M3 7h11M14 7l-3-3M14 7l-3 3" /><path d="M21 17H10M10 17l3-3M10 17l3 3" /></svg>);
export const Bolt = ({ s, c }: P) => (<svg {...base(s, c, 0)}><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill={c ?? "currentColor"} /></svg>);
export const CardIc = ({ s, c }: P) => (<svg {...base(s, c)}><rect x="2" y="5" width="20" height="14" rx="2.5" /><path d="M2 10h20M6 15.5h4" /></svg>);
export const Gear = ({ s, c }: P) => (<svg {...base(s, c)}><circle cx="12" cy="12" r="3" /><path d="M19.4 13a7.6 7.6 0 0 0 0-2l2-1.5-2-3.4-2.3.9a7.6 7.6 0 0 0-1.7-1L15 3h-4l-.4 2.5a7.6 7.6 0 0 0-1.9 1.1l-2.3-.9-2 3.4L6.4 11a7.6 7.6 0 0 0 0 2l-2 1.6 2 3.4 2.3-.9c.5.5 1.1.8 1.9 1.1L11 21h4l.4-2.5a7.6 7.6 0 0 0 1.7-1l2.3.9 2-3.4Z" /></svg>);

export const Signal = () => (<svg width="15" height="10" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.5" y="5" width="3" height="6" rx="1" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" /></svg>);
export const Wifi = () => (<svg width="14" height="10" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M1 4.2a10 10 0 0 1 14 0M3.6 7a6.4 6.4 0 0 1 8.8 0" /><circle cx="8" cy="10" r="1" fill="currentColor" stroke="none" /></svg>);
export const Batt = () => (<svg width="22" height="11" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="20" height="11" rx="3" stroke="currentColor" strokeOpacity="0.45" /><rect x="2" y="2" width="17" height="8" rx="1.8" fill="currentColor" /><path d="M22.5 4v4a2.2 2.2 0 0 0 0-4Z" fill="currentColor" fillOpacity="0.45" /></svg>);
export const RzLogo = ({ s = 16 }: P) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <path d="M18.5 3 15 17l-3.5.0L15 3h3.5Z" fill="#fff" />
    <path d="M12.8 3 5 13.5h4.3L6.6 21 17 8.5h-4.6L14 3h-1.2Z" fill="#fff" fillOpacity=".75" />
  </svg>
);
