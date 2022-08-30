import { ColorUnion } from './colorUnion';

export interface CategoryData {
  readonly id: string;
  name: string;
  color: ColorUnion;
}
