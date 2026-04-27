export function HpBar({ value, label }: { value: number; label: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="hp">
      <div className="hp__label">
        <span>{label}</span>
        <strong>{clamped}</strong>
      </div>
      <progress className="hp__bar" max={100} value={clamped} aria-label={`${label}: ${clamped}`} />
    </div>
  );
}
