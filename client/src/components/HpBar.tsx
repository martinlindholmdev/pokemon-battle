export function HpBar({ value, label }: { value: number; label: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  const filledPips = Math.ceil(clamped / 20);

  return (
    <div className="hp">
      <div className="hp__label">
        <span>{label}</span>
        <span className="hp__pips" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <span className={index < filledPips ? "filled" : ""} key={index} />
          ))}
        </span>
      </div>
      <progress className="hp__bar" max={100} value={clamped} aria-label={`${label}: ${clamped}`} />
    </div>
  );
}
