import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Category, Task } from '../interfaces/task.interface';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  public tasksSubject = new BehaviorSubject<Task[]>([]);
  public categoriesSubject = new BehaviorSubject<Category[]>([]);

  tasks$ = this.tasksSubject.asObservable();
  categories$ = this.categoriesSubject.asObservable();

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();//CREAMOS EL STORAGE
    const storedTasks = (await this._storage.get('tasks')) || []; //TRAEMOS LAS TAREAS
    const storedCategories = (await this._storage.get('categories')) || []; //TRAEMOS LAS CATEGORIAS

    this.tasksSubject.next(storedTasks);//COLOCAMOS EL VALOR EN EL BEHVIUR SUBJECT
    this.categoriesSubject.next(storedCategories);//COLOCAMOS EL VALOR EN EL BEHVIUR SUBJECT
  }

  public generateUUid(): string {
    return uuid();
  }

  private async updateStorage(key: string, data: any, subject: BehaviorSubject<any>) {
    await this._storage?.set(key, data);
    subject.next(data);
  }

  async saveTasks(tasks: Task[]) {
    await this.updateStorage('tasks', tasks, this.tasksSubject);
  }

  async saveCategories(categories: Category[]) {
    await this.updateStorage('categories', categories, this.categoriesSubject);
  }

  async addTask(task: Task) {
    const tasks = [...this.tasksSubject.value, task];
    await this.saveTasks(tasks);
  }

  async addCategory(category: Category) {
    const categories = [...this.categoriesSubject.value, category];
    await this.saveCategories(categories);
  }

  async deleteTask(taskId: string) {
    const updatedTasks = this.tasksSubject.value.filter(task => task.id !== taskId);
    await this.saveTasks(updatedTasks);
  }

  async getTasksByCategory(categoryName?: string): Promise<Task[]> {
    return categoryName
      ? this.tasksSubject.value.filter(task => task.catergoryName === categoryName)
      : this.tasksSubject.value;
  }

  async getCategories(): Promise<Category[]> {
    return this.categoriesSubject.value;
  }
}
