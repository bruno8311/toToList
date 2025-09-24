import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Category } from '../../../domain/entities/category';
import { Task } from '../../../domain/entities/task';
import { TaskPresentationService } from '../../services/task_presentation.service';
import { CategoryPresentationService } from '../../services/category_presentation.service';

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
    private taskPresentationService: TaskPresentationService,
    private categoryPresentationService: CategoryPresentationService,
  ) { }

  async ionViewWillEnter() {
    this.categoriesSubscription = this.categoryPresentationService.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
    });

    this.tasksSubscription = this.taskPresentationService.getTasks().subscribe((tasks: Task[]) => {
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
     if (this.task) {
       const updatedTask = new Task(
         this.task.id,
         this.name || this.task.title,
         this.task.completed,
         this.category?.id || this.task.categoryId,
         this.category?.name || this.task.categoryName
       );
       this.taskPresentationService.updateTask(updatedTask).subscribe();
     }
     this.dismiss();
  }

  public cancelTask(): void {
    this.dismiss();
  }
}
