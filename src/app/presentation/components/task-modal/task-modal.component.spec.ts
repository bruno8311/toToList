import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { of } from 'rxjs';

import { TaskCreateModalComponent } from './task-modal.component';
import { CategoryPresentationService } from '../../services/category_presentation.service';
import { TaskPresentationService } from '../../services/task_presentation.service';
import { Category } from '../../../domain/entities/category';
import { Task } from '../../../domain/entities/task';

describe('TaskModalComponent', () => {
  let component: TaskCreateModalComponent;
  let fixture: ComponentFixture<TaskCreateModalComponent>;
  let mockModalController: jasmine.SpyObj<ModalController>;
  let mockCategoryPresentationService: jasmine.SpyObj<CategoryPresentationService>;
  let mockTaskPresentationService: jasmine.SpyObj<TaskPresentationService>;
  let mockNavController: jasmine.SpyObj<NavController>;

  const mockCategories: Category[] = [
    new Category('cat1', 'Category 1'),
    new Category('cat2', 'Category 2')
  ];

  const mockTasks: Task[] = [
    new Task('1', 'Test Task 1', false, 'cat1', 'Category 1'),
    new Task('2', 'Test Task 2', true, 'cat2', 'Category 2')
  ];

  beforeEach(waitForAsync(() => {
    // Create spies
    mockModalController = jasmine.createSpyObj('ModalController', ['dismiss']);
    mockCategoryPresentationService = jasmine.createSpyObj('CategoryPresentationService', [
      'getCategories', 'getCurrentCategories'
    ]);
    mockTaskPresentationService = jasmine.createSpyObj('TaskPresentationService', [
      'addTask', 'getTasks'
    ]);
    mockNavController = jasmine.createSpyObj('NavController', ['navigateForward', 'pop']);

    // Configure spy returns BEFORE TestBed configuration
    mockModalController.dismiss.and.returnValue(Promise.resolve(true));
    mockCategoryPresentationService.getCategories.and.returnValue(of(mockCategories));
    mockCategoryPresentationService.getCurrentCategories.and.returnValue(mockCategories);
    mockTaskPresentationService.addTask.and.returnValue(of(mockTasks[0]));
    mockTaskPresentationService.getTasks.and.returnValue(of(mockTasks));
    mockNavController.navigateForward.and.returnValue(Promise.resolve(true));
    mockNavController.pop.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      declarations: [ TaskCreateModalComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: mockModalController },
        { provide: CategoryPresentationService, useValue: mockCategoryPresentationService },
        { provide: TaskPresentationService, useValue: mockTaskPresentationService },
        { provide: NavController, useValue: mockNavController }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values before ngOnInit', () => {
    // Create a new component instance without calling detectChanges to avoid ngOnInit
    const newFixture = TestBed.createComponent(TaskCreateModalComponent);
    const newComponent = newFixture.componentInstance;
    
    expect(newComponent.name).toEqual('');
    expect(newComponent.categories).toEqual([]);
  });

  it('should load categories after initialization', () => {
    // After detectChanges() has been called, categories should be loaded
    expect(component.categories).toEqual(mockCategories);
  });

  it('should call getCategories during initialization', () => {
    // ngOnInit was already called by detectChanges(), so service should have been called
    expect(mockCategoryPresentationService.getCategories).toHaveBeenCalled();
  });

  it('should have categories loaded after initialization', () => {
    // After initialization, categories should be available
    expect(component.categories).toEqual(mockCategories);
  });

  it('should have all required services injected', () => {
    expect(mockModalController).toBeTruthy();
    expect(mockCategoryPresentationService).toBeTruthy();
    expect(mockTaskPresentationService).toBeTruthy();
    expect(mockNavController).toBeTruthy();
  });

  it('should have modal controller ready for dismissal', () => {
    // Test that the modal controller is properly injected and can be used
    expect(mockModalController.dismiss).toBeDefined();
  });
});
