import { Component, EventEmitter, Output } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, NavController } from '@ionic/angular';
import { TaskPresentationService } from '../../services/task_presentation.service';
import { CategoryPresentationService } from '../../services/category_presentation.service';
import { TaskCreateModalComponent } from '../task-modal/task-modal.component';
import { Task } from '../../../domain/entities/task';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent {
  @Output() emitTasks = new EventEmitter<Task[]>();

  constructor(
    private taskPresentationService: TaskPresentationService,
    private categoryPresentationService: CategoryPresentationService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private navController: NavController,
    private alertController: AlertController 
  ) {}

  async openTaskMenu() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Agregar Nueva Tarea',
          icon: 'add',
          handler: () => {
            this.addNewTask();
          }
        },
        {
          text: 'Administrar Categorías',
          icon: 'list',
          handler: () => {
            this.redirectToCategories();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async addNewTask() {
    const modal = await this.modalCtrl.create({
      component: TaskCreateModalComponent,
    });
    modal.present();
  }

  async filterByCategory(){
    const categories = this.categoryPresentationService.getCurrentCategories();
    this.showCategoryAlert(categories);
  }

  private async showCategoryAlert(categories: any[]) {
    const alert = await this.alertController.create({
      header: 'Filtrar por Categoría',
      inputs: [
        ...categories.map((category: any) => ({
          type: 'radio' as const,
          label: category.name,
          value: category.name
        })),
        {
          type: 'radio' as const,
          label: 'Mostrar Todas',
          value: 'all',
          checked: true
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: async (selectedCategory) => {
            if (selectedCategory === 'all') {
              this.taskPresentationService.getTasks().subscribe(allTasks => {
                this.emitTasks.emit(allTasks);
              });
            } else {
              this.taskPresentationService.getTasksByCategory(selectedCategory).subscribe(filteredTasks => {
                this.emitTasks.emit(filteredTasks);
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }

  public redirectToCategories():void {
    this.navController.navigateForward('/categories');
  }
}