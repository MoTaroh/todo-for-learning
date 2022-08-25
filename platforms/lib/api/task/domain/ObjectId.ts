import cuid from 'cuid';

/**
 * This is common value object for cuid
 * Ex: TaskId, CategoryId, ...
 */
export class ObjectId {
  value: string;

  constructor(id?: string) {
    // TODO: validation for cuid
    this.value = id ? id : cuid();
  }
}
