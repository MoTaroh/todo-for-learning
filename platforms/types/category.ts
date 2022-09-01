import { ColorUnion } from './colorUnion';

export interface CategoryData {
  readonly id: string | undefined;
  name: string;
  color: ColorUnion;
}
