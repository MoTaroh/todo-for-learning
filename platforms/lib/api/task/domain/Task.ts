export class Task {
  id: string;
  name: string;
  done: boolean;
  removed: boolean;
  siteId: string;

  constructor(id: string, name: string, siteId: string) {
    if (!id || !name || !siteId) {
      throw new Error("Required param is missing.");
    }

    this.id = id;
    this.name = name;
    this.done = false;
    this.removed = false;
    this.siteId = siteId;
  }
}
