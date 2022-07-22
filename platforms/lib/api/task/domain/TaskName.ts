export class TaskName {
  private readonly TASK_NAME_MAX_LENGTH = 20;
  value: string;

  constructor(name: string) {
    if (name.length > this.TASK_NAME_MAX_LENGTH) {
      throw new Error(
        `タスク名は${this.TASK_NAME_MAX_LENGTH}文字以下で入力してください`
      );
    }
    this.value = name;
  }
}
