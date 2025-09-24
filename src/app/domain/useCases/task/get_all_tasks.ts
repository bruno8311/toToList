import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../../entities/task';
import { TaskRepository } from '../../repositories/task_repository';
import { TASK_REPOSITORY_TOKEN } from '../../tokens/injection-tokens';

@Injectable({
  providedIn: 'root'
})

export class GetAllTasks {

  constructor(@Inject(TASK_REPOSITORY_TOKEN) private readonly repository: TaskRepository) {}

  call(): Observable<Task[]> {
    return this.repository.getAllTasks();
  }
}
