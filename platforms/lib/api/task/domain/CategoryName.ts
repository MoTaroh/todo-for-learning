export class CategoryName {
  private readonly CATEGORY_NAME_MAX_LENGTH = 32;
  value: string;

  constructor(name: string) {
    if (0 === name.length || name.length > this.CATEGORY_NAME_MAX_LENGTH) {
      throw new Error(
        `カテゴリ名は1文字以上、${this.CATEGORY_NAME_MAX_LENGTH}文字以下で入力してください`
      );
    }
    this.value = name;
  }
}
