import cuid from 'cuid';

export class CategoryId {
  value: string;

  constructor(id?: string) {
    this.value = id ? id : cuid();
  }
}
