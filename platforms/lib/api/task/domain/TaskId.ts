import cuid from "cuid";

export class TaskId {
  value: string;

  constructor(id?: string) {
    this.value = id ? id : cuid();
  }
}
