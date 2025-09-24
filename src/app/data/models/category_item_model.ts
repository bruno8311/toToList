export class CategoryItemModel {
  constructor(
    public id: string,
    public name: string,
  ) {}

  static fromJson(json: any): CategoryItemModel {
    return new CategoryItemModel(
      json.id || '',
      json.name || '',
    );
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
    };
  }

  toStorage(): any {
    const storage: any = {
      id: this.id,
      name: this.name
    };
    return storage;
  }

  copyWith(updates: Partial<CategoryItemModel>): CategoryItemModel {
    return new CategoryItemModel(
      updates.id ?? this.id,
      updates.name ?? this.name,
    );
  }
}
