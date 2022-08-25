export class TaskName {
  private readonly TASK_NAME_MAX_LENGTH = 64;
  value: string;

  constructor(name: string) {
    if (0 === name.length || name.length > this.TASK_NAME_MAX_LENGTH) {
      throw new Error(
        `タスク名は1文字以上、${this.TASK_NAME_MAX_LENGTH}文字以下で入力してください`
      );
    }
    this.value = name;
  }
}
