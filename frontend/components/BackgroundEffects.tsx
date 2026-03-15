interface BackgroundEffectsProps {
  theme: "dark" | "light";
}

export default function BackgroundEffects({ theme }: BackgroundEffectsProps) {
  const rippleClasses = [
    "ripple-1",
    "ripple-2",
    "ripple-3",
    "ripple-4",
    "ripple-5",
    "ripple-6",
    "ripple-7",
  ];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        className={`absolute inset-0 ${
          theme === "dark"
            ? "bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.16),transparent_40%),radial-gradient(circle_at_78%_78%,rgba(251,146,60,0.18),transparent_45%),linear-gradient(180deg,#09090b_0%,#111827_100%)]"
            : "bg-[radial-gradient(circle_at_20%_20%,rgba(14,116,144,0.15),transparent_40%),radial-gradient(circle_at_82%_76%,rgba(249,115,22,0.12),transparent_45%),linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)]"
        }`}
      />
      <div
        className={`absolute inset-0 ${theme === "dark" ? "background-grid-primary-dark" : "background-grid-primary-light"}`}
      />
      <div
        className={`absolute inset-0 ${theme === "dark" ? "background-grid-secondary-dark" : "background-grid-secondary-light"}`}
      />
      <div
        className={`absolute -left-20 top-24 h-72 w-72 rounded-full blur-3xl animate-float-slow ${
          theme === "dark" ? "bg-sky-400/20" : "bg-cyan-400/20"
        }`}
      />
      <div
        className={`absolute right-6 bottom-16 h-80 w-80 rounded-full blur-3xl animate-float-medium ${
          theme === "dark" ? "bg-orange-400/18" : "bg-orange-500/18"
        }`}
      />
      {rippleClasses.map((rippleClass, index) => (
        <div key={index} className={`ripple ${rippleClass}`} />
      ))}
    </div>
  );
}
