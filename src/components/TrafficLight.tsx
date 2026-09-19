interface Props {
  risk: 'low' | 'medium' | 'high';
}

export function TrafficLight({ risk }: Props) {
  const lights = [
    { key: 'high', color: 'bg-danger-500', active: risk === 'high', glow: 'shadow-danger-500/50' },
    { key: 'medium', color: 'bg-warn-400', active: risk === 'medium', glow: 'shadow-warn-400/50' },
    { key: 'low', color: 'bg-brand-500', active: risk === 'low', glow: 'shadow-brand-500/50' },
  ] as const;

  return (
    <div className="inline-flex flex-col gap-2 p-3 rounded-2xl bg-gray-900 shadow-lg">
      {lights.map((l) => (
        <div
          key={l.key}
          className={`w-12 h-12 rounded-full transition-all duration-300 ${
            l.active
              ? `${l.color} shadow-lg ${l.glow} scale-100`
              : 'bg-gray-800 scale-90 opacity-40'
          }`}
        />
      ))}
    </div>
  );
}
