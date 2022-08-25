import { CategoryName } from '../CategoryName';

describe('ValueObject: CategoryName', () => {
  test('32文字以下の値を渡すと、正常にインスタンスが生成される', () => {
    // when
    const name = 'short task';
    const taskName = new CategoryName(name);

    // then
    expect(taskName.value).toEqual(name);
  });

  test('33文字以上の値を渡すと、例外が発生する', () => {
    // when & then
    expect(
      () =>
        new CategoryName(
          'This is very long task name so we can not assign. This is very long task name so we can not assign'
        )
    ).toThrow('カテゴリ名は1文字以上、32文字以下で入力してください');
  });

  test('0文字の値を渡すと、例外が発生する', () => {
    // when & then
    expect(() => new CategoryName('')).toThrow(
      'カテゴリ名は1文字以上、32文字以下で入力してください'
    );
  });
});
