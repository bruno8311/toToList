import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from '../../../domain/entities/category';
import { Task } from '../../../domain/entities/task';
import { CategoryPresentationService } from '../../services/category_presentation.service';
import { TaskPresentationService } from '../../services/task_presentation.service';

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


  constructor(
    private categoryPresentationService: CategoryPresentationService,
    private taskPresentationService: TaskPresentationService
  ) {}

  async ionViewWillEnter() {
    this.categoriesSubscription = this.categoryPresentationService.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
    });

    this.tasksSubscription = this.taskPresentationService.getTasks().subscribe((tasks: Task[]) => {
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
    const newCategory = new Category(
      this.generateUUID(),
      this.newCategory
    );
    this.categoryPresentationService.addCategory(newCategory).subscribe();
    this.newCategory = '';
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public startEditing(category: Category):void {
    this.editingCategoryId = category.id;
    this.editedCategoryName = category.name;
  }

  async saveEdit(categoryId: string, categoryName: string) {
    const category = this.categories.find(cat => cat.id === categoryId);
    if (category && this.editedCategoryName.trim() !== '') {
      const updatedCategory = new Category(category.id, this.editedCategoryName);
      this.categoryPresentationService.updateCategory(updatedCategory).subscribe();
    }
    
    // Actualizar tareas que tienen esta categoría
    const tasksToUpdate = this.tasks.filter(task => task.categoryName === categoryName);
    tasksToUpdate.forEach(task => {
      const updatedTask = new Task(
        task.id,
        task.title,
        task.completed,
        task.categoryId,
        this.editedCategoryName
      );
      this.taskPresentationService.updateTask(updatedTask).subscribe();
    });
    
    this.editingCategoryId = null;
  }

  public cancelEdit(): void {
    this.editingCategoryId = null;
  }

  async deleteCategory(categoryId: string) {
    this.categoryPresentationService.deleteCategory(categoryId).subscribe();
  }
}
