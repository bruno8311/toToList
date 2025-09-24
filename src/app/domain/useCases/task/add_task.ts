import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../../entities/task';
import { TaskRepository } from '../../repositories/task_repository';
import { TASK_REPOSITORY_TOKEN } from '../../tokens/injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class AddTask {

  constructor(@Inject(TASK_REPOSITORY_TOKEN) private readonly repository: TaskRepository) {}  call(taskData: {
    id: string;
    title: string;
    categoryId?: string;
    categoryName?: string;
  }): Observable<Task> {
    const task = new Task(
      taskData.id,
      taskData.title,
      false, // Nueva tarea siempre empieza como pendiente
      taskData.categoryId,
      taskData.categoryName
    );
    return this.repository.addTask(task);
  }
}
