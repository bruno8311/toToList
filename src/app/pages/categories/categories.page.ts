import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category, Task } from 'src/app/interfaces/task.interface';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: false
})
export class CategoriesPage implements OnDestroy {

  categories: Category[] = [];
  tasks: Task[] = [];
  newCategory: string = '';
  editingCategoryId: string | null = null;
  editedCategoryName: string = '';
  actionButtonsOn = true;
  private categoriesSubscription!: Subscription;
  private tasksSubscription!: Subscription;


  constructor(private storageService: StorageService) {}

  async ionViewWillEnter() {
    this.categoriesSubscription = this.storageService.categories$.subscribe(categories => {
      this.categories = categories;
    });

    this.tasksSubscription = this.storageService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  ngOnDestroy() {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }

  async addCategory() {
    if (this.newCategory.trim() === '') return;
    const newCategory: Category = {
      id: this.storageService.generateUUid(),
      name: this.newCategory
    };
    await this.storageService.addCategory(newCategory)
    this.newCategory = '';
  }

  public startEditing(category: Category):void {
    this.editingCategoryId = category.id;
    this.editedCategoryName = category.name;
  }

  async saveEdit(categoryId: string, categoryName: string) {
    const category = this.categories.find(cat => cat.id === categoryId);
    if (category && this.editedCategoryName.trim() !== '') {
      category.name = this.editedCategoryName;
      await this.storageService.saveCategories(this.categories)
    }
    const updatedTasks = this.tasks.map(task => {
      if (task.catergoryName === categoryName) {
        return { ...task, catergoryName: this.editedCategoryName };
      }
      return task;
    });
      if (updatedTasks.length > 0) {
        await this.storageService.saveTasks(updatedTasks);
      }
    this.editingCategoryId = null;
  }

  public cancelEdit(): void {
    this.editingCategoryId = null;
  }

  async deleteCategory(categoryId: string) {
    this.categories = this.categories.filter(cat => cat.id !== categoryId);
    await this.storageService.saveCategories(this.categories)
  }
}
