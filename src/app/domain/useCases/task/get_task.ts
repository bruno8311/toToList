import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../../entities/task';
import { TaskRepository } from '../../repositories/task_repository';
import { TASK_REPOSITORY_TOKEN } from '../../tokens/injection-tokens';

/**
 * Caso de uso para obtener una tarea por ID
 */
@Injectable({
  providedIn: 'root'
})
export class GetTask {
  
  constructor(@Inject(TASK_REPOSITORY_TOKEN) private readonly repository: TaskRepository) {}

  call(id: string): Observable<Task | null> {
    if (!id || id.trim().length === 0) {
      throw new Error('ID de tarea no válido');
    }
    
    return this.repository.getTask(id);
  }
}
