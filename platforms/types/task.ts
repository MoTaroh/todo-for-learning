export interface TaskData {
  readonly id: string | undefined;
  name: string;
  description: string;
  done: boolean;
  removed: boolean;
  categoryId: string | null;
}
