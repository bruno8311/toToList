import { Task } from '../../domain/entities/task';
import { TaskItemModel } from '../models/task_item_model';

export class TaskMapper {

  static toDomain(model: TaskItemModel): Task {
    return new Task(
      model.id,
      model.title,
      model.completed,
      model.categoryId,
      model.categoryName
    );
  }

  static toData(entity: Task): TaskItemModel {
    return new TaskItemModel(
      entity.id,
      entity.title,
      entity.completed,
      entity.categoryId,
      entity.categoryName,
    );
  }
}
