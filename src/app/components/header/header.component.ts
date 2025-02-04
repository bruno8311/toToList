import { Component, EventEmitter, Output } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, NavController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { Task } from 'src/app/interfaces/task.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent {
  @Output() emitTasks = new EventEmitter<Task[]>();

  constructor(
    private storageService: StorageService,
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
      component: TaskModalComponent,
    });
    modal.present();
  }

  async filterByCategory(){
    const categories = await this.storageService.getCategories();

    const alert = await this.alertController.create({
      header: 'Filtrar por Categoría',
      inputs: [
        ...categories.map(category => ({
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
              const allTasks = await this.storageService.getTasksByCategory();
              this.emitTasks.emit(allTasks);
            } else {
              const filteredTasks = await this.storageService.getTasksByCategory(selectedCategory);
              this.emitTasks.emit(filteredTasks);
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