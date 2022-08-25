export class TaskDescription {
  private readonly TASK_DESCRIPTION_MAX_LENGTH = 256;
  value: string | null;

  constructor(description: string | null) {
    if (description && description.length > this.TASK_DESCRIPTION_MAX_LENGTH) {
      throw new Error(
        `タスク説明は${this.TASK_DESCRIPTION_MAX_LENGTH}文字以下で入力してください`
      );
    }
    this.value = description || null;
  }
}
