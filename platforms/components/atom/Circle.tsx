import { ColorUnion } from '@/types/colorUnion';

interface Props {
  size: 'small' | 'big';
  color: ColorUnion | undefined;
}

export default function Circle({ size, color }: Props) {
  return (
    <div
      className={`bg-${color}-600 rounded-full ${
        size === 'small' ? 'w-3 h-3' : 'w-5 h-5'
      }`}
    ></div>
  );
}
