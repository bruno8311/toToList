import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Task } from '../../../domain/entities/task';
import { TaskPresentationService } from '../../services/task_presentation.service';
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
    private taskPresentationService: TaskPresentationService,
    private modalCtrl: ModalController
  ) { }

  public deleteTask(taskId: string): void {
      this.taskPresentationService.deleteTask(taskId).subscribe();
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
      const taskToUpdate = this.tasks.find(task => task.id === taskId);
      if (taskToUpdate) {
        const updatedTask = new Task(
          taskToUpdate.id,
          taskToUpdate.title,
          completed,
          taskToUpdate.categoryId,
          taskToUpdate.categoryName
        );
        this.taskPresentationService.updateTask(updatedTask).subscribe();
      }
  }

}
