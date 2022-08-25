type ColorUnion =
  | 'gray'
  | 'red'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink';

export class CategoryColor {
  value: ColorUnion;

  constructor(color: ColorUnion | null) {
    // default -> gray
    this.value = color || 'gray';
  }
}
