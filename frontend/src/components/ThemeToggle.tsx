import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative w-14 h-7 rounded-full transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
      style={{
        backgroundColor: isDark ? "#3730a3" : "#e0e7ff",
      }}
    >
      {/* Track stars (dark mode decoration) */}
      <span
        className="absolute inset-0 rounded-full overflow-hidden pointer-events-none transition-opacity duration-500"
        style={{ opacity: isDark ? 1 : 0 }}
      >
        <span className="absolute top-1 left-2 w-0.5 h-0.5 rounded-full bg-white/70" />
        <span className="absolute top-3 left-4 w-1 h-1 rounded-full bg-white/60" />
        <span className="absolute bottom-1.5 left-3 w-0.5 h-0.5 rounded-full bg-white/50" />
      </span>

      {/* Track clouds (light mode decoration) */}
      <span
        className="absolute inset-0 rounded-full overflow-hidden pointer-events-none transition-opacity duration-500"
        style={{ opacity: isDark ? 0 : 1 }}
      >
        <span className="absolute top-2 right-3 w-2.5 h-1.5 rounded-full bg-white/80 -translate-y-0.5" />
        <span className="absolute bottom-2 right-5 w-1.5 h-1 rounded-full bg-white/60" />
      </span>

      {/* The sliding circle (sun / moon) */}
      <span
        className="absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all duration-500 ease-in-out"
        style={{
          left: isDark ? "calc(100% - 1.75rem)" : "0.125rem",
          backgroundColor: isDark ? "#c7d2fe" : "#fde68a",
        }}
      >
        {/* Sun rays */}
        <span
          className="absolute inset-0 flex items-center justify-center transition-all duration-300"
          style={{ opacity: isDark ? 0 : 1, transform: isDark ? "scale(0.5) rotate(90deg)" : "scale(1) rotate(0deg)" }}
        >
          {/* Center dot */}
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          {/* Rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <span
              key={deg}
              className="absolute w-0.5 h-1 bg-amber-400 rounded-full origin-bottom"
              style={{
                transform: `rotate(${deg}deg) translateY(-10px)`,
                top: "50%",
                left: "50%",
                marginLeft: "-1px",
                marginTop: "-2px",
              }}
            />
          ))}
        </span>

        {/* Moon crescent */}
        <span
          className="absolute inset-0 flex items-center justify-center transition-all duration-300"
          style={{ opacity: isDark ? 1 : 0, transform: isDark ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(-90deg)" }}
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-indigo-800">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
