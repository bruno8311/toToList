import { Component, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TaskModalComponent } from 'src/app/components/task-modal/task-modal.component';
import { Category, Task } from 'src/app/interfaces/task.interface';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnDestroy {

  tasks: Task[] = [];
  categories: Category[] = [];
  selectedCategory: string | null = null;
  isOpen = false;
  existingTasks:Task[] = [];
  private tasksSubscription!: Subscription;


  constructor(
    private storageService: StorageService, 
    private modalCtrl: ModalController
  ) {}

  async ionViewWillEnter() {
    this.tasksSubscription = this.storageService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  public ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  public onEmitTask(mensaje: any): void {
    this.tasks = mensaje;
  }

  async addNewTask() {
    const modal = await this.modalCtrl.create({
      component: TaskModalComponent,
    });
    modal.present();
  }
    
  async saveTask(task: Task) {
    this.tasks.push(task);
    await this.storageService.saveTasks(this.tasks);
  }


  public onTaskCompletionChange(taskId: string, completed: boolean): void {
    const updatedTasks = this.tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: completed };
      }
      return task;
    });
    this.storageService.saveTasks(updatedTasks);
    this.tasks = updatedTasks;
  }
}