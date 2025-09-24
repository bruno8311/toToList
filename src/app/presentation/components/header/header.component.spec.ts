import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, ActionSheetController, NavController, AlertController } from '@ionic/angular';
import { of } from 'rxjs';

import { HeaderComponent } from './header.component';
import { TaskPresentationService } from '../../services/task_presentation.service';
import { CategoryPresentationService } from '../../services/category_presentation.service';
import { Category } from '../../../domain/entities/category';
import { Task } from '../../../domain/entities/task';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockTaskPresentationService: jasmine.SpyObj<TaskPresentationService>;
  let mockCategoryPresentationService: jasmine.SpyObj<CategoryPresentationService>;
  let mockModalController: jasmine.SpyObj<ModalController>;
  let mockActionSheetController: jasmine.SpyObj<ActionSheetController>;
  let mockNavController: jasmine.SpyObj<NavController>;
  let mockAlertController: jasmine.SpyObj<AlertController>;

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
    mockTaskPresentationService = jasmine.createSpyObj('TaskPresentationService', [
      'getTasks', 'getCurrentTasks', 'addTask', 'saveTasks'
    ]);
    mockCategoryPresentationService = jasmine.createSpyObj('CategoryPresentationService', [
      'getCategories', 'getCurrentCategories'
    ]);
    mockModalController = jasmine.createSpyObj('ModalController', ['create']);
    mockActionSheetController = jasmine.createSpyObj('ActionSheetController', ['create']);
    mockNavController = jasmine.createSpyObj('NavController', ['navigateForward']);
    mockAlertController = jasmine.createSpyObj('AlertController', ['create']);

    mockTaskPresentationService.getTasks.and.returnValue(of(mockTasks));
    mockTaskPresentationService.getCurrentTasks.and.returnValue(mockTasks);
    mockTaskPresentationService.addTask.and.returnValue(of(mockTasks[0]));
    mockTaskPresentationService.saveTasks.and.returnValue(of(undefined));
    mockCategoryPresentationService.getCategories.and.returnValue(of(mockCategories));
    mockCategoryPresentationService.getCurrentCategories.and.returnValue(mockCategories);
    
    mockModalController.create.and.returnValue(Promise.resolve({
      present: jasmine.createSpy('present'),
      onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(Promise.resolve({ data: null }))
    } as any));
    
    mockActionSheetController.create.and.returnValue(Promise.resolve({
      present: jasmine.createSpy('present')
    } as any));
    
    mockAlertController.create.and.returnValue(Promise.resolve({
      present: jasmine.createSpy('present')
    } as any));
    
    mockNavController.navigateForward.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: TaskPresentationService, useValue: mockTaskPresentationService },
        { provide: CategoryPresentationService, useValue: mockCategoryPresentationService },
        { provide: ModalController, useValue: mockModalController },
        { provide: ActionSheetController, useValue: mockActionSheetController },
        { provide: NavController, useValue: mockNavController },
        { provide: AlertController, useValue: mockAlertController }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have emitTasks output property', () => {
    expect(component.emitTasks).toBeDefined();
    expect(component.emitTasks.emit).toBeDefined();
  });

  it('should create action sheet when openTaskMenu is called', async () => {
    await component.openTaskMenu();
    expect(mockActionSheetController.create).toHaveBeenCalledWith({
      header: 'Opciones',
      buttons: jasmine.any(Array)
    });
  });

  it('should have all required services injected', () => {
    expect(mockTaskPresentationService).toBeTruthy();
    expect(mockCategoryPresentationService).toBeTruthy();
    expect(mockModalController).toBeTruthy();
    expect(mockActionSheetController).toBeTruthy();
    expect(mockNavController).toBeTruthy();
    expect(mockAlertController).toBeTruthy();
  });

  it('should have access to task and category services', () => {
    expect(mockTaskPresentationService.getTasks).toBeDefined();
    expect(mockCategoryPresentationService.getCategories).toBeDefined();
  });

  it('should be able to navigate', () => {
    expect(mockNavController.navigateForward).toBeDefined();
  });

  it('should emit tasks through output property', () => {
    spyOn(component.emitTasks, 'emit');
    
    const testTasks = mockTasks;
    component.emitTasks.emit(testTasks);
    
    expect(component.emitTasks.emit).toHaveBeenCalledWith(testTasks);
  });
});
