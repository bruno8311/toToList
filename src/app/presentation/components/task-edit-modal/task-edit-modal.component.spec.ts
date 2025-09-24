import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { of } from 'rxjs';

import { TaskEditModalComponent } from './task-edit-modal.component';
import { TaskPresentationService } from '../../services/task_presentation.service';
import { CategoryPresentationService } from '../../services/category_presentation.service';
import { Category } from '../../../domain/entities/category';
import { Task } from '../../../domain/entities/task';

describe('TaskEditModalComponent', () => {
  let component: TaskEditModalComponent;
  let fixture: ComponentFixture<TaskEditModalComponent>;
  let mockModalController: jasmine.SpyObj<ModalController>;
  let mockTaskPresentationService: jasmine.SpyObj<TaskPresentationService>;
  let mockCategoryPresentationService: jasmine.SpyObj<CategoryPresentationService>;

  const mockCategories: Category[] = [
    new Category('cat1', 'Category 1'),
    new Category('cat2', 'Category 2')
  ];

  const mockTasks: Task[] = [
    new Task('1', 'Test Task 1', false, 'cat1', 'Category 1'),
    new Task('2', 'Test Task 2', true, 'cat2', 'Category 2')
  ];

  const mockInputTask = new Task('1', 'Edit Task', false, 'cat1', 'Category 1');

  beforeEach(waitForAsync(() => {
    // Create spies
    mockModalController = jasmine.createSpyObj('ModalController', ['dismiss']);
    mockTaskPresentationService = jasmine.createSpyObj('TaskPresentationService', [
      'getTasks', 'updateTask', 'getCurrentTasks'
    ]);
    mockCategoryPresentationService = jasmine.createSpyObj('CategoryPresentationService', [
      'getCategories', 'getCurrentCategories'
    ]);

    // Configure spy returns BEFORE TestBed configuration
    mockModalController.dismiss.and.returnValue(Promise.resolve(true));
    mockTaskPresentationService.getTasks.and.returnValue(of(mockTasks));
    mockTaskPresentationService.updateTask.and.returnValue(of(mockTasks[0]));
    mockTaskPresentationService.getCurrentTasks.and.returnValue(mockTasks);
    mockCategoryPresentationService.getCategories.and.returnValue(of(mockCategories));
    mockCategoryPresentationService.getCurrentCategories.and.returnValue(mockCategories);

    TestBed.configureTestingModule({
      declarations: [ TaskEditModalComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: mockModalController },
        { provide: TaskPresentationService, useValue: mockTaskPresentationService },
        { provide: CategoryPresentationService, useValue: mockCategoryPresentationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskEditModalComponent);
    component = fixture.componentInstance;
    
    // Set the required @Input property
    component.task = mockInputTask;
    
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.name).toEqual('');
    expect(component.categories).toEqual([]);
    expect(component.tasks).toEqual([]);
  });

  it('should have input task set', () => {
    expect(component.task).toEqual(mockInputTask);
  });

  it('should load categories and tasks on ionViewWillEnter', async () => {
    await component.ionViewWillEnter();
    
    expect(mockCategoryPresentationService.getCategories).toHaveBeenCalled();
    expect(mockTaskPresentationService.getTasks).toHaveBeenCalled();
  });

  it('should subscribe to categories and tasks observables', (done) => {
    component.ionViewWillEnter().then(() => {
      // Give some time for subscriptions to process
      setTimeout(() => {
        expect(component.categories).toEqual(mockCategories);
        expect(component.tasks).toEqual(mockTasks);
        done();
      }, 0);
    });
  });

  it('should have all required services injected', () => {
    expect(mockModalController).toBeTruthy();
    expect(mockTaskPresentationService).toBeTruthy();
    expect(mockCategoryPresentationService).toBeTruthy();
  });

  it('should have modal controller ready for dismissal', () => {
    expect(mockModalController.dismiss).toBeDefined();
  });
});
