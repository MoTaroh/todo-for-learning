import cuid from 'cuid';
import { Category } from '../Category';
import { CategoryColor } from '../CategoryColor';
import { ObjectId } from '../ObjectId';
import { CategoryName } from '../CategoryName';

const categoryName = new CategoryName('Test category');
const categoryColor = new CategoryColor('red');
const userId = cuid();

describe('Entity: Category', () => {
  describe('Creation Method', () => {
    test('新しくカテゴリーを作成すると、インスタンスが生成される', () => {
      const category = Category.create(categoryName, categoryColor, userId);

      // then
      expect(category.name).toEqual(categoryName);
      expect(category.color).toEqual(categoryColor);
      expect(category.userId).toEqual(userId);
    });
  });

  describe('Reconstruct Method', () => {
    test('reconstructに値を渡すと、渡した値でインスタンスが作成される', () => {
      // given
      // DBからのレコードのイメージ
      const categoryRecord = {
        id: new ObjectId(),
        name: categoryName,
        color: categoryColor,
        userId: userId,
      };

      // when
      const category = Category.reconstruct(categoryRecord);

      // then
      expect(category.id).toEqual(categoryRecord.id);
      expect(category.name).toEqual(categoryRecord.name);
      expect(category.color).toEqual(categoryRecord.color);
      expect(category.userId).toEqual(categoryRecord.userId);
    });
  });
});
