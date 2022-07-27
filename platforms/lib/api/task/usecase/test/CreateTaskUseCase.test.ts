import cuid from 'cuid';
import { Task } from '../../domain/Task';
import { TaskId } from '../../domain/TaskId';
import { TaskName } from '../../domain/TaskName';
import { TaskRepository } from '../../infrastructure/TaskRepository';
import { CreateTaskUseCase } from '../CreateTaskUseCase';

const createTaskUseCase = new CreateTaskUseCase();

describe('UseCase: CreateTask', () => {
  test('タスク名などを渡すと、その値を使用して新規作成されたタスクが保存される', async () => {
    // given
    const taskName = 'test task';
    const userId = cuid();
    const createSpy = jest
      .spyOn(TaskRepository.prototype, 'create')
      .mockResolvedValue(
        Task.reconstruct({
          id: new TaskId(),
          name: new TaskName(taskName),
          done: false,
          removed: false,
          userId: userId,
        })
      );

    // when
    await createTaskUseCase.execute(taskName, userId);

    // then
    expect(createSpy).toHaveBeenCalled();
  });
});
