import { TaskName } from '../TaskName';

describe('ValueObject: TaskName', () => {
  test('20文字以下の値を渡すと、正常にインスタンスが生成される', () => {
    // when
    const name = 'short task';
    const taskName = new TaskName(name);

    // then
    expect(taskName.value).toEqual(name);
  });

  test('21文字以上の値を渡すと、例外が発生する', () => {
    // when & then
    expect(
      () => new TaskName('This is very long task name so we can not assign.')
    ).toThrow('タスク名は20文字以下で入力してください');
  });
});
