import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TaskCreateModalComponent } from '../../components/task-modal/task-modal.component';
import { Task } from '../../../domain/entities/task';
import { Category } from '../../../domain/entities/category';
import { TaskPresentationService } from '../../services/task_presentation.service';
import { FeatureFlagService } from '../../services/feature-flag.service';

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
  private tasksSubscription!: Subscription;
  featureFlagEnabled: boolean = false;  // Variable para almacenar si la característica está habilitada
  private featureFlagSub!: Subscription;

  constructor(
    private taskPresentationService: TaskPresentationService, 
    private modalCtrl: ModalController,
    private featureFlagService: FeatureFlagService,
    private crd: ChangeDetectorRef
  ) {
    
  }

  async ionViewWillEnter() {
    await this.fetchFeatureFlag();
    this.tasksSubscription = this.taskPresentationService.getTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }

  async fetchFeatureFlag() {
    this.featureFlagSub = this.featureFlagService.featureFlag$.subscribe((flag: boolean) => {
      this.featureFlagEnabled = flag;
      setTimeout(() => {
        this.crd.detectChanges();
      });
    });
  }

  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
    if (this.featureFlagSub) {
      this.featureFlagSub.unsubscribe();
    }
  }
  
  public onEmitTask(taskEmit: Task[]): void {
    this.tasks = taskEmit;
  }

  async addNewTask() {
    const modal = await this.modalCtrl.create({
      component: TaskCreateModalComponent,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        console.log('Tarea creada:', result.data);
      }
    });
    modal.present();
  }

  async saveTask(task: Task) {
    this.taskPresentationService.addTask(task).subscribe(() => {
    });
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
