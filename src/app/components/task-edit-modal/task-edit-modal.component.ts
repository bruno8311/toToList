import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Category, Task } from 'src/app/interfaces/task.interface';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-task-edit-modal',
  templateUrl: './task-edit-modal.component.html',
  styleUrls: ['./task-edit-modal.component.scss'],
  standalone: false,
})
export class TaskEditModalComponent {
    @Input() task!: Task
    category!: Category;
    name: string = '';
    categories: Category[] = [];
    tasks: Task[] = [];
    private categoriesSubscription!: Subscription;
    private tasksSubscription!: Subscription;

  constructor(
    private modalController: ModalController,
    private storageService: StorageService,
  ) { }

  async ionViewWillEnter() {
    this.categoriesSubscription = this.storageService.categories$.subscribe(categories => {
      this.categories = categories;
    });

    this.tasksSubscription = this.storageService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  public ngOnDestroy():void  {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
      this.categoriesSubscription.unsubscribe();
    }
  }

  public dismiss(): void {
    this.modalController.dismiss();
  }

  public editTask(): void {
     this.storageService.saveTasks(this.tasks);
     this.dismiss();
  }

  public cancelTask(): void {
    this.dismiss();
  }
}
