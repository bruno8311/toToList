import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskRepository } from '../../repositories/task_repository';
import { TASK_REPOSITORY_TOKEN } from '../../tokens/injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class DeleteTask {
  
  constructor(@Inject(TASK_REPOSITORY_TOKEN) private readonly repository: TaskRepository) {}

  call(id: string): Observable<boolean> {
    if (!id || id.trim().length === 0) {
      throw new Error('ID de tarea no válido');
    }

    return this.repository.deleteTask(id);
  }
}
