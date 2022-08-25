import { CategoryColor } from '../CategoryColor';

const DEFAULT_COLOR = 'gray';

describe('ValueObject: CategoryColor', () => {
  test('Unionに定義された値を渡すと、正常にインスタンスが生成される', () => {
    const color = 'blue';
    const categoryColor = new CategoryColor(color);

    expect(categoryColor.value).toEqual(color);
  });

  test('nullを渡すと、デフォルト値でインスタンスが生成される', () => {
    const color = null;
    const categoryColor = new CategoryColor(color);

    expect(categoryColor.value).toEqual(DEFAULT_COLOR);
  });
});
