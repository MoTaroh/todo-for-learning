import cuid from 'cuid';
import { Task } from '../../domain/Task';
import { TaskId } from '../../domain/TaskId';
import { TaskName } from '../../domain/TaskName';
import { TaskRepository } from '../../infrastructure/TaskRepository';
import { FindTaskUseCase } from '../FindTaskUseCase';

const findTaskUseCase = new FindTaskUseCase();

describe('UseCase: findTask', () => {
  describe('FindAll', () => {
    test('Taskリポジトリから値が取得できる場合、結果がDTOに詰め替えて返される', async () => {
      // given
      // These are for mock response. TODO: use mockDB
      const userId = cuid();
      const taskName = 'mock task';
      const findSpy = jest
        .spyOn(TaskRepository.prototype, 'findAll')
        .mockResolvedValue([
          Task.reconstruct({
            id: new TaskId(),
            name: new TaskName(taskName),
            done: false,
            removed: false,
            userId: userId,
          }),
        ]);

      // when
      const response = await findTaskUseCase.findAllTasks(userId);

      // then
      expect(findSpy).toHaveBeenCalled();
      expect(response.length).toEqual(1);
    });

    test('Taskリポジトリから返される値が空配列の場合、空配列が返される', async () => {
      // given
      const userId = cuid();
      const findSpy = jest
        .spyOn(TaskRepository.prototype, 'findAll')
        .mockResolvedValue([]);

      // when
      const response = await findTaskUseCase.findAllTasks(userId);

      // then
      expect(findSpy).toHaveBeenCalled();
      expect(response.length).toEqual(0);
    });
  });

  describe.skip('FindByID', () => {
    // pass for now
  });
});
