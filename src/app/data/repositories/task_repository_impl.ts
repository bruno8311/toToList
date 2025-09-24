import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Task } from '../../domain/entities/task';
import { TaskRepository } from '../../domain/repositories/task_repository';
import { TaskLocalDatasource } from '../datasources/task_local_datasource';
import { TaskReactiveDatasource } from '../datasources/task_reactive_datasource';
import { TaskMapper } from '../mappers/task_mapper';


@Injectable({
  providedIn: 'root'
})
export class TaskRepositoryImpl implements TaskRepository {

  constructor(
    private localDatasource: TaskLocalDatasource,
    private reactiveDatasource: TaskReactiveDatasource
  ) {}

  getAllTasks(): Observable<Task[]> {
    return new Observable(observer => {
      this.reactiveDatasource.tasks$.subscribe(taskModels => {
        const tasks = taskModels.map(model => TaskMapper.toDomain(model));
        observer.next(tasks);
      });
    });
  }

  getTask(id: string): Observable<Task | null> {
    return new Observable(observer => {
      this.reactiveDatasource.tasks$.subscribe(taskModels => {
        const taskModel = taskModels.find(t => t.id === id);
        const task = taskModel ? TaskMapper.toDomain(taskModel) : null;
        observer.next(task);
      });
    });
  }

  addTask(task: Task): Observable<Task> {
    return from(this.addTaskAsync(task));
  }

  private async addTaskAsync(task: Task): Promise<Task> {
    try {
      const taskModel = TaskMapper.toData(task);
      const savedModel = await this.reactiveDatasource.addTask(taskModel);
      return TaskMapper.toDomain(savedModel);
    } catch (error) {
      console.error('Error creando tarea:', error);
      throw error;
    }
  }

  updateTask(task: Task): Observable<Task> {
    return from(this.updateTaskAsync(task));
  }

  private async updateTaskAsync(task: Task): Promise<Task> {
    try {
      const taskModel = TaskMapper.toData(task);
      const updatedModel = await this.reactiveDatasource.updateTask(taskModel);
      return TaskMapper.toDomain(updatedModel);
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      throw error;
    }
  }

  deleteTask(id: string): Observable<boolean> {
    return from(this.deleteTaskAsync(id));
  }

  private async deleteTaskAsync(id: string): Promise<boolean> {
    try {
      return await this.reactiveDatasource.deleteTask(id);
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      throw error;
    }
  }

  getTasksByCategory(categoryName?: string): Observable<Task[]> {
    return from(this.getTasksByCategoryAsync(categoryName));
  }

  private async getTasksByCategoryAsync(categoryName?: string): Promise<Task[]> {
    try {
      const taskModels = await this.reactiveDatasource.getTasksByCategory(categoryName);
      return taskModels.map(model => TaskMapper.toDomain(model));
    } catch (error) {
      console.error('Error obteniendo tareas por categoría:', error);
      return [];
    }
  }

  saveTasks(tasks: Task[]): Observable<void> {
    return from(this.saveTasksAsync(tasks));
  }

  private async saveTasksAsync(tasks: Task[]): Promise<void> {
    try {
      const taskModels = tasks.map(task => TaskMapper.toData(task));
      await this.reactiveDatasource.saveTasks(taskModels);
    } catch (error) {
      console.error('Error guardando tareas:', error);
      throw error;
    }
  }
}
