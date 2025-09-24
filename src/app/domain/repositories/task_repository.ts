import { Observable } from 'rxjs';
import { Task } from '../entities/task';

/**
 * Interfaz del repositorio para Task
 * Define el contrato que debe cumplir cualquier implementación
 */
export interface TaskRepository {
  getAllTasks(): Observable<Task[]>;
  getTask(id: string): Observable<Task | null>;
  addTask(task: Task): Observable<Task>;
  updateTask(task: Task): Observable<Task>;
  deleteTask(id: string): Observable<boolean>;
  getTasksByCategory(categoryName?: string): Observable<Task[]>;
  saveTasks(tasks: Task[]): Observable<void>;
}