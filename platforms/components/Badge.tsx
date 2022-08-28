interface Props {
  name: string;
  color: string;
}

export default function Badge({ name, color }: Props) {
  const bgColor = `bg-${color}-200`;
  const textColor = `text-${color}-800`;
  return (
    <div
      className={`flex items-center justify-center px-2 py-1 rounded ${bgColor} ${textColor}`}
    >
      <span className="text-sm font-semibold">{name}</span>
    </div>
  );
}
