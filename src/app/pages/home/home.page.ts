import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TaskCreateModalComponent } from 'src/app/components/task-modal/task-modal.component';
import { Category, Task } from 'src/app/interfaces/task.interface';
import { StorageService } from 'src/app/services/storage.service';
import { FirebaseX } from '@awesome-cordova-plugins/firebase-x/ngx';
import { FeatureFlagService } from 'src/app/services/feature-flag.service';

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
  existingTasks: Task[] = [];
  private tasksSubscription!: Subscription;
  featureFlagEnabled: boolean = false;  // Variable para almacenar si la característica está habilitada
  private featureFlagSub!: Subscription;

  constructor(
    private storageService: StorageService, 
    private modalCtrl: ModalController,
    private featureFlagService: FeatureFlagService, // Inyecta el servicio
    private crd: ChangeDetectorRef
  ) {
    
  }

  async ionViewWillEnter() {
    await this.fetchFeatureFlag();
    this.tasksSubscription = this.storageService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  async fetchFeatureFlag() {
    this.featureFlagSub = this.featureFlagService.featureFlag$.subscribe(flag => {
      this.featureFlagEnabled = flag;
      setTimeout(() => {
        this.crd.detectChanges();
      });
    });
  }
  

  public onEmitTask(mensaje: any): void {
    this.tasks = mensaje;
  }

  async addNewTask() {
    const modal = await this.modalCtrl.create({
      component: TaskCreateModalComponent,
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
