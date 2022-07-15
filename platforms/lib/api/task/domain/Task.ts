export class Task {
  id?: string;
  name: string;
  done: boolean;
  removed: boolean;

  constructor(name: string) {
    if (!name) {
      throw new Error("name is needed.");
    }
    this.name = name;
    this.done = false;
    this.removed = false;
  }
}
