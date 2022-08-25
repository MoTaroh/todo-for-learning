import cuid from 'cuid';
import { CategoryId } from '../CategoryId';
import { Task } from '../Task';
import { TaskDescription } from '../TaskDescription';
import { TaskId } from '../TaskId';
import { TaskName } from '../TaskName';

const taskName = new TaskName('Test task');
const taskDescription = new TaskDescription('Test task description');
const categoryId = new CategoryId(cuid());
const userId = cuid();
const task = Task.create(taskName, taskDescription, categoryId, userId);

describe('Entity: Task', () => {
  describe('Creation Method', () => {
    test('新しくタスクを作成すると、未完了かつ未削除のインスタンスが生成される', () => {
      // then
      expect(task.done).toEqual(false);
      expect(task.removed).toEqual(false);
      expect(task.name).toEqual(taskName);
      expect(task.description).toEqual(taskDescription);
      expect(task.categoryId).toEqual(categoryId);
      expect(task.userId).toEqual(userId);
    });
  });

  describe('Mutation Method', () => {
    describe('完了状態', () => {
      test('タスクを完了すると、完了状態になる', () => {
        // when
        task.doneTask();

        // then
        expect(task.done).toEqual(true);
      });
      test('タスクを未完了にすると、未完了状態になる', () => {
        task.doneTask();

        // when
        task.undoneTask();

        // then
        expect(task.done).toEqual(false);
      });
      test('タスクが削除状態の場合、完了状態を変更しようとすると例外が発生する', () => {
        task.remove();

        // when & then
        expect(() => task.doneTask()).toThrow('削除済みタスクは編集できません');
      });
    });

    describe('削除状態', () => {
      test('タスクを削除すると、削除状態になる', () => {
        // when
        task.remove();

        // then
        expect(task.removed).toEqual(true);
      });
      test('タスクを復元すると、未削除状態になる', () => {
        task.remove();

        // when
        task.restore();

        // then
        expect(task.removed).toEqual(false);
      });
    });

    describe('タスク詳細の更新', () => {
      test('タスク名を更新すると、更新される', () => {
        const newName = new TaskName('Updated');

        // when
        task.changeName(newName);

        // then
        expect(task.name).toEqual(newName);
      });
    });
  });

  describe('Reconstruct Method', () => {
    test('reconstructに値を渡すと、渡した値でインスタンスが作成される', () => {
      // given
      // DBからのレコードのイメージ
      const taskRecord = {
        id: new TaskId(),
        name: taskName,
        description: taskDescription,
        done: true,
        removed: true,
        categoryId: categoryId,
        userId: userId,
      };

      // when
      const task = Task.reconstruct(taskRecord);

      // then
      expect(task.id).toEqual(taskRecord.id);
      expect(task.name).toEqual(taskRecord.name);
      expect(task.description).toEqual(taskRecord.description);
      expect(task.done).toEqual(taskRecord.done);
      expect(task.removed).toEqual(taskRecord.removed);
      expect(task.categoryId).toEqual(taskRecord.categoryId);
      expect(task.userId).toEqual(taskRecord.userId);
    });
  });
});
