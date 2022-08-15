import { TaskId } from './TaskId';
import { TaskName } from './TaskName';

interface TaskType {
  id: TaskId;
  name: TaskName;
  done: boolean;
  removed: boolean;
  userId: string;
}

export class Task implements TaskType {
  id: TaskId;
  name: TaskName;
  done: boolean;
  removed: boolean;
  userId: string;

  private constructor(
    id: TaskId,
    name: TaskName,
    done: boolean,
    removed: boolean,
    userId: string
  ) {
    this.id = id;
    this.name = name;
    this.done = done;
    this.removed = removed;
    this.userId = userId;
  }

  // TODO: 値オブジェクトを導入する
  /**
   * Factory method
   * @param name
   * @param userId
   * @returns
   */
  static create(name: TaskName, userId: string) {
    const id = new TaskId();
    const taskName = name;
    const done = false;
    const removed = false;
    const uId = userId;

    return new Task(id, taskName, done, removed, uId);
  }

  static reconstruct(taskRecord: TaskType): Task {
    return new Task(
      taskRecord.id,
      taskRecord.name,
      taskRecord.done,
      taskRecord.removed,
      taskRecord.userId
    );
  }

  doneTask() {
    // TODO: use Enum map?
    if (this.removed) {
      throw new Error('削除済みタスクは編集できません');
    }
    this.done = true;
  }
  undoneTask() {
    // TODO: use Enum map?
    if (this.removed) {
      throw new Error('削除済みタスクは編集できません');
    }
    this.done = false;
  }
  remove() {
    this.removed = true;
  }
  restore() {
    this.removed = false;
  }
  changeName(name: TaskName) {
    if (this.removed) {
      throw new Error('削除済みタスクは編集できません');
    }
    this.name = name;
  }
}
