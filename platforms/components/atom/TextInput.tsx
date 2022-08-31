interface Props {
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextInput({ id, placeholder, value, onChange }: Props) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="text-gray-900 border-gray-900 rounded"
    />
  );
}
