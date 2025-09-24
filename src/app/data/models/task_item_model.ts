export class TaskItemModel {
  constructor(
    public id: string,
    public title: string,
    public completed: boolean,
    public categoryId?: string,
    public categoryName?: string,
  ) {}

  static fromJson(json: any): TaskItemModel {
    return new TaskItemModel(
      json.id || '',
      json.title || '',
      json.completed || false,
      json.categoryId,
      json.categoryName,
    );
  }

  toJson(): any {
    return {
      id: this.id,
      title: this.title,
      completed: this.completed,
      categoryId: this.categoryId,
      categoryName: this.categoryName,
    };
  }

  toStorage(): any {
    const storage: any = {
      id: this.id,
      title: this.title,
      completed: this.completed
    };

    if (this.categoryId) {
      storage.categoryId = this.categoryId;
    }
    
    if (this.categoryName) {
      storage.categoryName = this.categoryName;
      // Mantener compatibilidad con el typo original
      storage.catergoryName = this.categoryName;
    }

    return storage;
  }

  copyWith(updates: Partial<TaskItemModel>): TaskItemModel {
    return new TaskItemModel(
      updates.id ?? this.id,
      updates.title ?? this.title,
      updates.completed ?? this.completed,
      updates.categoryId ?? this.categoryId,
      updates.categoryName ?? this.categoryName,
    );
  }
}
