import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { of } from 'rxjs';

import { TaskListComponent } from './task-list.component';
import { TaskPresentationService } from '../../services/task_presentation.service';
import { Task } from '../../../domain/entities/task';
import { TaskEditModalComponent } from '../task-edit-modal/task-edit-modal.component';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let mockTaskPresentationService: jasmine.SpyObj<TaskPresentationService>;
  let mockModalController: jasmine.SpyObj<ModalController>;

  const mockTasks: Task[] = [
    new Task('1', 'Test Task 1', false, 'cat1', 'Category 1'),
    new Task('2', 'Test Task 2', true, 'cat2', 'Category 2')
  ];

  beforeEach(waitForAsync(() => {
    // Create spies
    mockTaskPresentationService = jasmine.createSpyObj('TaskPresentationService', ['deleteTask']);
    mockModalController = jasmine.createSpyObj('ModalController', ['create']);

    // Configure spy returns BEFORE TestBed configuration
    mockTaskPresentationService.deleteTask.and.returnValue(of(true));
    mockModalController.create.and.returnValue(Promise.resolve({
      present: jasmine.createSpy('present'),
      onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(Promise.resolve({ data: null }))
    } as any));

    TestBed.configureTestingModule({
      declarations: [ TaskListComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: TaskPresentationService, useValue: mockTaskPresentationService },
        { provide: ModalController, useValue: mockModalController }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    component.tasks = mockTasks; // Set input property
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty tasks array', () => {
    const newComponent = new TaskListComponent(mockTaskPresentationService, mockModalController);
    expect(newComponent.tasks).toEqual([]);
  });

  it('should display provided tasks', () => {
    expect(component.tasks).toEqual(mockTasks);
  });

  it('should delete task when deleteTask is called', () => {
    component.deleteTask('1');
    expect(mockTaskPresentationService.deleteTask).toHaveBeenCalledWith('1');
  });

  it('should create modal when editTask is called', async () => {
    const task = mockTasks[0];
    await component.editTask(task);
    
    expect(mockModalController.create).toHaveBeenCalledWith({
      component: TaskEditModalComponent,
      componentProps: {
        task: task
      }
    });
  });
});
