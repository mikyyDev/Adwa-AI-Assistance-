interface BackgroundEffectsProps {
  theme: "dark" | "light";
}

export default function BackgroundEffects({ theme }: BackgroundEffectsProps) {
  const emberClasses = [
    "adwa-ember-1",
    "adwa-ember-2",
    "adwa-ember-3",
    "adwa-ember-4",
    "adwa-ember-5",
    "adwa-ember-6",
  ];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        className={`absolute inset-0 ${
          theme === "dark"
            ? "bg-[radial-gradient(circle_at_55%_18%,rgba(251,146,60,0.22),transparent_38%),radial-gradient(circle_at_8%_12%,rgba(190,24,93,0.14),transparent_34%),linear-gradient(180deg,#06070b_0%,#10141e_44%,#1a1f2a_100%)]"
            : "bg-[radial-gradient(circle_at_52%_16%,rgba(249,115,22,0.22),transparent_40%),radial-gradient(circle_at_15%_14%,rgba(251,191,36,0.14),transparent_32%),linear-gradient(180deg,#fff8ef_0%,#f6e9d3_40%,#e9ddca_100%)]"
        }`}
      />

      <div
        className={`absolute inset-0 ${
          theme === "dark" ? "adwa-contour-dark" : "adwa-contour-light"
        }`}
      />

      <div
        className={`absolute inset-0 ${theme === "dark" ? "background-grid-primary-dark" : "background-grid-primary-light"}`}
      />
      <div
        className={`absolute inset-0 ${theme === "dark" ? "background-grid-secondary-dark" : "background-grid-secondary-light"}`}
      />

      <div className="absolute inset-x-0 bottom-0 h-[43vh] adwa-ridge-back" />
      <div className="absolute inset-x-0 bottom-0 h-[36vh] adwa-ridge-front" />

      <div className="absolute left-[12%] top-[18%] h-24 w-px adwa-banner-pole" />
      <div className="absolute left-[12%] top-[18%] h-6 w-12 adwa-banner-cloth" />

      <div
        className={`absolute -left-16 top-16 h-72 w-72 rounded-full blur-3xl animate-float-slow ${
          theme === "dark" ? "bg-amber-400/16" : "bg-orange-400/16"
        }`}
      />
      <div
        className={`absolute right-2 bottom-20 h-80 w-80 rounded-full blur-3xl animate-float-medium ${
          theme === "dark" ? "bg-rose-400/14" : "bg-amber-500/14"
        }`}
      />

      {emberClasses.map((emberClass, index) => (
        <div key={index} className={`adwa-ember ${emberClass}`} />
      ))}
    </div>
  );
}
