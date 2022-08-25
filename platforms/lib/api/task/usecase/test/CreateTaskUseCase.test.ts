import cuid from 'cuid';
import { ObjectId } from '../../domain/ObjectId';
import { Task } from '../../domain/Task';
import { TaskDescription } from '../../domain/TaskDescription';
import { TaskName } from '../../domain/TaskName';
import { TaskRepository } from '../../infrastructure/TaskRepository';
import { CreateTaskUseCase } from '../CreateTaskUseCase';

const createTaskUseCase = new CreateTaskUseCase();

describe('UseCase: CreateTask', () => {
  test('タスク名などを渡すと、その値を使用して新規作成されたタスクが保存される', async () => {
    // given
    const taskName = 'test task';
    const taskDescription = 'test task description';
    const categoryId = cuid();
    const userId = cuid();
    const createSpy = jest
      .spyOn(TaskRepository.prototype, 'create')
      .mockResolvedValue(
        Task.reconstruct({
          id: new ObjectId(),
          name: new TaskName(taskName),
          description: new TaskDescription(taskDescription),
          done: false,
          removed: false,
          categoryId: new ObjectId(categoryId),
          userId: userId,
        })
      );

    // when
    await createTaskUseCase.execute(
      taskName,
      taskDescription,
      categoryId,
      userId
    );

    // then
    expect(createSpy).toHaveBeenCalled();
  });
});
