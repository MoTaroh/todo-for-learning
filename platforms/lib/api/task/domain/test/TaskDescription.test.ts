import { TaskDescription } from '../TaskDescription';

describe('ValueObject: TaskDescription', () => {
  test('256文字以下の値を渡すと、正常にインスタンスが生成される', () => {
    // when
    const description = 'short description';
    const taskDescription = new TaskDescription(description);

    // then
    expect(taskDescription.value).toEqual(description);
  });

  test('nullの場合、nullのインスタンスが生成される', () => {
    // when
    const description = null;
    const taskDescription = new TaskDescription(description);

    // then
    expect(taskDescription.value).toEqual(description);
  });

  test('257文字以上の値を渡すと、例外が発生する', () => {
    // when & then
    expect(
      () =>
        new TaskDescription(
          'This is very long task description so we can not assign.' +
            'This is very long task description so we can not assign.' +
            'This is very long task description so we can not assign.' +
            'This is very long task description so we can not assign.' +
            'This is very long task description so we can not assign.'
        )
    ).toThrow('タスク説明は256文字以下で入力してください');
  });
});
