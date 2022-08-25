const colors = [
  'gray',
  'red',
  'yellow',
  'green',
  'blue',
  'indigo',
  'purple',
  'pink',
] as const;
export type Color = typeof colors[number];

export class CategoryColor {
  private readonly defaultColor = colors[0];
  value: Color;

  constructor(color: string | null) {
    // default -> gray
    this.value = this.isColor(color) ? color : this.defaultColor;
  }

  private isColor(color: string | null): color is Color {
    return colors.includes(color as Color);
  }
}
