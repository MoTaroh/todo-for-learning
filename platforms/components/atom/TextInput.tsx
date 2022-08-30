interface Props {
  id: string;
  placeholder: string;
}

export default function TextInput({ id, placeholder }: Props) {
  return (
    <input
      id={id}
      type="text"
      placeholder={placeholder}
      className="text-gray-900 border-gray-900 rounded"
    />
  );
}
