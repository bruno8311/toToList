import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Task } from '../../domain/entities/task';
import { GetAllTasks } from '../../domain/useCases/task/get_all_tasks';
import { GetTask } from '../../domain/useCases/task/get_task';
import { AddTask } from '../../domain/useCases/task/add_task';
import { UpdateTask } from '../../domain/useCases/task/update_task';
import { DeleteTask } from '../../domain/useCases/task/delete_task';

/**
 * Servicio de presentación para tareas
 * Actúa como facade entre los componentes y el dominio
 * Reemplaza al StorageService original manteniendo la misma interfaz
 */
@Injectable({
  providedIn: 'root'
})
export class TaskPresentationService {
  
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(
    private getAllTasksUseCase: GetAllTasks,
    private getTaskUseCase: GetTask,
    private addTaskUseCase: AddTask,
    private updateTaskUseCase: UpdateTask,
    private deleteTaskUseCase: DeleteTask
  ) {
    this.initializeTasks();
  }

  /**
   * Inicializa las tareas desde el repositorio
   */
  private initializeTasks(): void {
    this.getAllTasksUseCase.call().subscribe((tasks: Task[]) => {
      this.tasksSubject.next(tasks);
    });
  }


  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  getCurrentTasks(): Task[] {
    return this.tasksSubject.value;
  }

  getTaskById(id: string): Observable<Task | null> {
    return this.getTaskUseCase.call(id);
  }

  addTask(task: Task): Observable<Task> {
    return new Observable(observer => {
      this.addTaskUseCase.call({
        id: task.id,
        title: task.title,
        categoryId: task.categoryId,
        categoryName: task.categoryName
      }).subscribe(
        (savedTask: Task) => {
          observer.next(savedTask);
          observer.complete();
        },
        (error: any) => observer.error(error)
      );
    });
  }

  updateTask(task: Task): Observable<Task> {
    return new Observable(observer => {
      this.updateTaskUseCase.call({
        id: task.id,
        title: task.title,
        completed: task.completed,
        categoryId: task.categoryId,
        categoryName: task.categoryName
      }).subscribe(
        (updatedTask: Task) => {
          observer.next(updatedTask);
          observer.complete();
        },
        (error: any) => observer.error(error)
      );
    });
  }

  deleteTask(id: string): Observable<boolean> {
    return new Observable(observer => {
      this.deleteTaskUseCase.call(id).subscribe(
        (deleted: boolean) => {
          observer.next(deleted);
          observer.complete();
        },
        (error: any) => observer.error(error)
      );
    });
  }

  saveTasks(tasks: Task[]): Observable<void> {
    return new Observable(observer => {
      let completed = 0;
      const total = tasks.length;

      if (total === 0) {
        this.tasksSubject.next([]);
        observer.next();
        observer.complete();
        return;
      }

      tasks.forEach(task => {
        this.updateTaskUseCase.call({
          id: task.id,
          title: task.title,
          completed: task.completed,
          categoryId: task.categoryId,
          categoryName: task.categoryName
        }).subscribe(
          () => {
            completed++;
            if (completed === total) {
              this.tasksSubject.next(tasks);
              observer.next();
              observer.complete();
            }
          },
          (error: any) => observer.error(error)
        );
      });
    });
  }

  getTasksByCategory(categoryName?: string): Observable<Task[]> {
    return new Observable(observer => {
      this.tasks$.subscribe(tasks => {
        if (categoryName) {
          const filteredTasks = tasks.filter(task => task.categoryName === categoryName);
          observer.next(filteredTasks);
        } else {
          observer.next(tasks);
        }
      });
    });
  }

  refreshTasks(): void {
    this.initializeTasks();
  }

  taskExists(id: string): boolean {
    return this.getCurrentTasks().some(task => task.id === id);
  }

  getTaskCount(): number {
    return this.getCurrentTasks().length;
  }

  getCompletedTaskCount(): number {
    return this.getCurrentTasks().filter(task => task.completed).length;
  }

  getPendingTaskCount(): number {
    return this.getCurrentTasks().filter(task => !task.completed).length;
  }
}
