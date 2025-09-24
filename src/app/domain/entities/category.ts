export class Category {
  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {
    if (!id || id.trim().length === 0) {
      throw new Error('El ID de la categoría es requerido');
    }
    if (!name || name.trim().length === 0) {
      throw new Error('El nombre de la categoría es requerido');
    }
  }
}
