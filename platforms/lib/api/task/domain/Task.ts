import { CategoryId } from './CategoryId';
import { TaskDescription } from './TaskDescription';
import { TaskId } from './TaskId';
import { TaskName } from './TaskName';

interface TaskType {
  id: TaskId;
  name: TaskName;
  description: TaskDescription;
  done: boolean;
  removed: boolean;
  categoryId: CategoryId;
  userId: string;
}

export class Task implements TaskType {
  id: TaskId;
  name: TaskName;
  description: TaskDescription;
  done: boolean;
  removed: boolean;
  categoryId: CategoryId;
  userId: string;

  private constructor(
    id: TaskId,
    name: TaskName,
    description: TaskDescription,
    done: boolean,
    removed: boolean,
    categoryId: CategoryId,
    userId: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.done = done;
    this.removed = removed;
    this.categoryId = categoryId;
    this.userId = userId;
  }

  // TODO: 値オブジェクトを導入する
  /**
   * Factory method
   * @param name
   * @param userId
   * @returns
   */
  static create(
    name: TaskName,
    description: TaskDescription,
    category: CategoryId,
    userId: string
  ) {
    const id = new TaskId();
    const taskName = name;
    const taskDescription = description;
    const done = false;
    const removed = false;
    const categoryId = category;
    const uId = userId;

    return new Task(
      id,
      taskName,
      taskDescription,
      done,
      removed,
      categoryId,
      uId
    );
  }

  static reconstruct(taskRecord: TaskType): Task {
    return new Task(
      taskRecord.id,
      taskRecord.name,
      taskRecord.description,
      taskRecord.done,
      taskRecord.removed,
      taskRecord.categoryId,
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
