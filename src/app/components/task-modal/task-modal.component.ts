import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { Category, Task } from 'src/app/interfaces/task.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
  standalone: false
})
export class TaskCreateModalComponent {
  category!: Category;
  name: string = '';
  categories: Category[] = [];
  private categoriesSubscription!: Subscription;

  constructor(
    private modalController: ModalController,
    private storageService: StorageService,
    private navController: NavController,
  ) {}

  async ionViewWillEnter() {
    this.categoriesSubscription = this.storageService.categories$.subscribe(categories => {
      this.categories = categories;
    });
  }

  ngOnDestroy() {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }

  public dismiss(): void {
    this.modalController.dismiss();
  }

  async createTask() {
    if (this.name) {
      const newTask: Task = {
        completed: false,
        id: this.storageService.generateUUid(),
        title: this.name,
        catergoryName: this.category?.name || undefined,
        categoryId: this.category?.id || undefined
      };

      await this.storageService.addTask(newTask);
      this.modalController.dismiss(newTask);
    }
  }

  public redirectoCategories(): void {
    this.modalController.dismiss(); 
    this.navController.navigateForward('/categories');
  }

  public isInvalidButton(): boolean {
    return !(this.category && this.name);
  }
}