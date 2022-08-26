interface Props {
  color: string;
  text: string;
  open: boolean;
}

export default function NavigationButton({ color, text, open }: Props) {
  const bgColor = 'bg-' + color + '-600';

  return (
    <a
      className={`flex items-center justify-center p-3 space-x-2 rounded hover:bg-white ${
        !open && 'w-12 h-12'
      }`}
    >
      <div
        className={`${open ? 'w-3 h-3' : 'w-5 h-5'} ${bgColor} rounded-full`}
      ></div>
      {open && <span className="flex-1 text-lg text-gray-900">{text}</span>}
    </a>
  );
}
