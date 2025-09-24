import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { CategoryPresentationService } from '../../services/category_presentation.service';
import { TaskPresentationService } from '../../services/task_presentation.service';
import { Category } from '../../../domain/entities/category';
import { Task } from '../../../domain/entities/task';
import { IdGeneratorRepository } from '../../../domain/repositories/id_generator_repository';
import { ID_GENERATOR_REPOSITORY_TOKEN } from '../../../domain/tokens/injection-tokens';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
  standalone: false
})
export class TaskCreateModalComponent implements OnInit, OnDestroy {
  category!: Category;
  name: string = '';
  categories: Category[] = [];
  private categoriesSubscription!: Subscription;

  constructor(
    private modalController: ModalController,
    private categoryPresentationService: CategoryPresentationService,
    private taskPresentationService: TaskPresentationService,
    private navController: NavController,
    @Inject(ID_GENERATOR_REPOSITORY_TOKEN) private idGeneratorRepository: IdGeneratorRepository
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.categoriesSubscription = this.categoryPresentationService.getCategories().subscribe((categories: Category[]) => {
      console.log('📂 Categorías cargadas:', categories);
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
    const isValidTask = this.name && this.name.trim().length > 0;
    if (isValidTask) {
      const newTask = new Task(
        this.idGeneratorRepository.generateId(),
        this.name.trim(),
        false,
        this.category?.id || undefined,
        this.category?.name || undefined
      );

      this.taskPresentationService.addTask(newTask).subscribe(
        (savedTask) => {
          this.modalController.dismiss(savedTask);
        },
        (error) => {
          // Agregar dismiss even en error
          this.modalController.dismiss();
        }
      );
    }
  }

  public redirectoCategories(): void {
    this.modalController.dismiss(); 
    this.navController.navigateForward('/categories');
  }

  public isInvalidButton(): boolean {
    const isInvalid = !(this.name && this.name.trim().length > 0);
    console.log('🔍 isInvalidButton:', isInvalid, { 
      hasCategory: !!this.category, 
      hasName: !!this.name,
      nameLength: this.name?.trim().length || 0
    });
    return isInvalid;
  }
}