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
  private readonly DEFAULT_COLOR = 'gray';
  value: ColorUnion;

  constructor(color: ColorUnion | null) {
    // default -> gray
    this.value = color || this.DEFAULT_COLOR;
  }
}
