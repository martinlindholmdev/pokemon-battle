export function HpBar({ value, label }: { value: number; label: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="hp">
      <div className="hp__label">
        <span>{label}</span>
        <strong>{clamped}</strong>
      </div>
      <div className="hp__track">
        <span style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
