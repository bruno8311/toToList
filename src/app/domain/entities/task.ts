export class Task {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly completed: boolean,
    public readonly categoryId?: string,
    public readonly categoryName?: string,
  ) {
    if (!id || id.trim().length === 0) {
      throw new Error('El ID de la tarea es requerido');
    }
    if (!title || title.trim().length === 0) {
      throw new Error('El título de la tarea es requerido');
    }
  }
}
