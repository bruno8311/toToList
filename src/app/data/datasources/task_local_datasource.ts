import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { TaskItemModel } from '../models/task_item_model';

@Injectable({
  providedIn: 'root'
})
export class TaskLocalDatasource {
  private readonly TASKS_KEY = 'tasks';
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  private async init(): Promise<void> {
    this._storage = await this.storage.create();
  }

  getAllTasks(): Observable<TaskItemModel[]> {
    return from(this.getStoredTasks());
  }

  async getTask(id: string): Promise<TaskItemModel | null> {
    const tasks = await this.getStoredTasks();
    const found = tasks.find(task => task.id === id);
    return found || null;
  }

  async saveTask(task: TaskItemModel): Promise<TaskItemModel> {
    const tasks = await this.getStoredTasks();
    const updatedTasks = [...tasks, task];
    await this.saveTasks(updatedTasks);
    return task;
  }

  async updateTask(task: TaskItemModel): Promise<TaskItemModel> {
    const tasks = await this.getStoredTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    
    if (index === -1) {
      throw new Error('Tarea no encontrada');
    }

    tasks[index] = task;
    await this.saveTasks(tasks);
    return task;
  }

  async deleteTask(id: string): Promise<boolean> {
    const tasks = await this.getStoredTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (tasks.length === filteredTasks.length) {
      return false; // No se encontró la tarea
    }

    await this.saveTasks(filteredTasks);
    return true;
  }

  async getTasksByCategory(categoryName?: string): Promise<TaskItemModel[]> {
    const tasks = await this.getStoredTasks();
    return categoryName 
      ? tasks.filter(task => task.categoryName === categoryName)
      : tasks;
  }

  private async getStoredTasks(): Promise<TaskItemModel[]> {
    if (!this._storage) {
      await this.init();
    }
    
    const stored = await this._storage?.get(this.TASKS_KEY) || [];
    return stored.map((item: any) => TaskItemModel.fromJson(item));
  }

  private async saveTasks(tasks: TaskItemModel[]): Promise<void> {
    if (!this._storage) {
      await this.init();
    }
    
    const toStore = tasks.map(task => task.toStorage());
    await this._storage?.set(this.TASKS_KEY, toStore);
  }
}
