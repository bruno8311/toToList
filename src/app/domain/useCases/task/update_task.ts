import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../../entities/task';
import { TaskRepository } from '../../repositories/task_repository';
import { TASK_REPOSITORY_TOKEN } from '../../tokens/injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class UpdateTask {
  
  constructor(@Inject(TASK_REPOSITORY_TOKEN) private readonly repository: TaskRepository) {}

  call(taskData: {
    id: string;
    title: string;
    completed: boolean;
    categoryId?: string;
    categoryName?: string;
  }): Observable<Task> {
    const updatedTask = new Task(
      taskData.id,
      taskData.title,
      taskData.completed,
      taskData.categoryId,
      taskData.categoryName
    );
    return this.repository.updateTask(updatedTask);
  }
}
