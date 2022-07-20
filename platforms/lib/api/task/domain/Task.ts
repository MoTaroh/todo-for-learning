export class Task {
  id: string;
  name: string;
  done: boolean;
  removed: boolean;
  userId: string;

  constructor(id: string, name: string, userId: string) {
    if (!id || !name || !userId) {
      throw new Error("Required param is missing.");
    }

    this.id = id;
    this.name = name;
    this.done = false;
    this.removed = false;
    this.userId = userId;
  }
}
