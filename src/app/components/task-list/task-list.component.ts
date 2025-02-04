import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Task } from 'src/app/interfaces/task.interface';
import { StorageService } from 'src/app/services/storage.service';
import { TaskEditModalComponent } from '../task-edit-modal/task-edit-modal.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: false
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];

  constructor(
    private storageService: StorageService,
    private modalCtrl: ModalController
  ) { }

  public deleteTask(taskId: string): void {
      this.storageService.deleteTask(taskId);
  }
  
  public async editTask(task: Task) {
    const modal = await this.modalCtrl.create({
      component: TaskEditModalComponent,
      componentProps: {
        task
      }
      });
    modal.present();
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
