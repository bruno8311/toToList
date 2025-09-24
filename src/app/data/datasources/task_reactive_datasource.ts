import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TaskItemModel } from '../models/task_item_model';
import { TaskLocalDatasource } from './task_local_datasource';

@Injectable({
  providedIn: 'root'
})
export class TaskReactiveDatasource {
  private tasksSubject = new BehaviorSubject<TaskItemModel[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private localDatasource: TaskLocalDatasource) {
    this.initializeTasks();
  }

  private async initializeTasks(): Promise<void> {
    try {
      this.localDatasource.getAllTasks().subscribe(tasks => {
        this.tasksSubject.next(tasks);
      });
    } catch (error) {
      console.error('Error inicializando tareas:', error);
    }
  }

  getCurrentTasks(): TaskItemModel[] {
    return this.tasksSubject.value;
  }

  async addTask(task: TaskItemModel): Promise<TaskItemModel> {
    try {
      const savedTask = await this.localDatasource.saveTask(task);
      const currentTasks = this.getCurrentTasks();
      this.tasksSubject.next([...currentTasks, savedTask]);
      return savedTask;
    } catch (error) {
      console.error('Error agregando tarea:', error);
      throw error;
    }
  }

  async updateTask(task: TaskItemModel): Promise<TaskItemModel> {
    try {
      const updatedTask = await this.localDatasource.updateTask(task);
      const currentTasks = this.getCurrentTasks();
      const updatedTasks = currentTasks.map(t => 
        t.id === task.id ? updatedTask : t
      );
      this.tasksSubject.next(updatedTasks);
      return updatedTask;
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      const deleted = await this.localDatasource.deleteTask(id);
      if (deleted) {
        const currentTasks = this.getCurrentTasks();
        const filteredTasks = currentTasks.filter(task => task.id !== id);
        this.tasksSubject.next(filteredTasks);
      }
      return deleted;
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      throw error;
    }
  }

  async saveTasks(tasks: TaskItemModel[]): Promise<void> {
    try {
      // Guardar cada tarea individualmente
      for (const task of tasks) {
        await this.localDatasource.updateTask(task);
      }
      // Actualizar el estado reactive
      this.tasksSubject.next(tasks);
    } catch (error) {
      console.error('Error guardando tareas:', error);
      throw error;
    }
  }

  async getTasksByCategory(categoryName?: string): Promise<TaskItemModel[]> {
    return this.localDatasource.getTasksByCategory(categoryName);
  }

  async refreshTasks(): Promise<void> {
    try {
      this.localDatasource.getAllTasks().subscribe(tasks => {
        this.tasksSubject.next(tasks);
      });
    } catch (error) {
      console.error('Error refrescando tareas:', error);
    }
  }
}
