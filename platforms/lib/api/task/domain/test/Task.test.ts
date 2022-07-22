import cuid from "cuid";
import { Task } from "../Task";
import { TaskId } from "../TaskId";
import { TaskName } from "../TaskName";

const taskName = new TaskName("Test task");

describe("Entity: Task", () => {
  describe("Creation Method", () => {
    test("新しくタスクを作成すると、未完了かつ未削除のインスタンスが生成される", () => {
      // when
      const userId = cuid();
      const task = Task.create(taskName, userId);

      // then
      expect(task.done).toEqual(false);
      expect(task.removed).toEqual(false);
      expect(task.name).toEqual(taskName);
      expect(task.userId).toEqual(userId);
    });
  });

  describe("Mutation Method", () => {
    describe("完了状態", () => {
      test("タスクを完了すると、完了状態になる", () => {
        // given
        const task = Task.create(taskName, cuid());

        // when
        task.doneTask();

        // then
        expect(task.done).toEqual(true);
      });
      test("タスクを未完了にすると、未完了状態になる", () => {
        // given
        const task = Task.create(taskName, cuid());
        task.doneTask();

        // when
        task.undoneTask();

        // then
        expect(task.done).toEqual(false);
      });
    });

    describe("削除状態", () => {
      test("タスクを削除すると、削除状態になる", () => {
        // given
        const task = Task.create(taskName, cuid());

        // when
        task.remove();

        // then
        expect(task.removed).toEqual(true);
      });
      test("タスクを復元すると、未削除状態になる", () => {
        // given
        const task = Task.create(taskName, cuid());
        task.remove();

        // when
        task.restore();

        // then
        expect(task.removed).toEqual(false);
      });
    });
  });

  describe("Reconstruct Method", () => {
    test("reconstructに値を渡すと、渡した値でインスタンスが作成される", () => {
      // given
      // DBからのレコードのイメージ
      const taskRecord = {
        id: new TaskId(),
        name: new TaskName("Test task"),
        done: true,
        removed: true,
        userId: cuid(),
      };

      // when
      const task = Task.reconstruct(taskRecord);

      // then
      expect(task.id).toEqual(taskRecord.id);
      expect(task.name).toEqual(taskRecord.name);
      expect(task.done).toEqual(taskRecord.done);
      expect(task.removed).toEqual(taskRecord.removed);
      expect(task.userId).toEqual(taskRecord.userId);
    });
  });
});
