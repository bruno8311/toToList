import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TaskPresentationService } from './task_presentation.service';
import { GetAllTasks } from '../../domain/useCases/task/get_all_tasks';
import { GetTask } from '../../domain/useCases/task/get_task';
import { AddTask } from '../../domain/useCases/task/add_task';
import { UpdateTask } from '../../domain/useCases/task/update_task';
import { DeleteTask } from '../../domain/useCases/task/delete_task';
import { Task } from '../../domain/entities/task';

describe('TaskPresentationService', () => {
  let service: TaskPresentationService;
  let mockGetAllTasks: jasmine.SpyObj<GetAllTasks>;
  let mockGetTask: jasmine.SpyObj<GetTask>;
  let mockAddTask: jasmine.SpyObj<AddTask>;
  let mockUpdateTask: jasmine.SpyObj<UpdateTask>;
  let mockDeleteTask: jasmine.SpyObj<DeleteTask>;

  const mockTasks: Task[] = [
    new Task('1', 'Test Task 1', false, 'cat1', 'Category 1'),
    new Task('2', 'Test Task 2', true, 'cat2', 'Category 2')
  ];

  beforeEach(() => {
    const getAllTasksSpy = jasmine.createSpyObj('GetAllTasks', ['call']);
    const getTaskSpy = jasmine.createSpyObj('GetTask', ['call']);
    const addTaskSpy = jasmine.createSpyObj('AddTask', ['call']);
    const updateTaskSpy = jasmine.createSpyObj('UpdateTask', ['call']);
    const deleteTaskSpy = jasmine.createSpyObj('DeleteTask', ['call']);

    getAllTasksSpy.call.and.returnValue(of(mockTasks));
    getTaskSpy.call.and.returnValue(of(mockTasks[0]));
    addTaskSpy.call.and.returnValue(of(mockTasks[0]));
    updateTaskSpy.call.and.returnValue(of(mockTasks[0]));
    deleteTaskSpy.call.and.returnValue(of(true));

    TestBed.configureTestingModule({
      providers: [
        TaskPresentationService,
        { provide: GetAllTasks, useValue: getAllTasksSpy },
        { provide: GetTask, useValue: getTaskSpy },
        { provide: AddTask, useValue: addTaskSpy },
        { provide: UpdateTask, useValue: updateTaskSpy },
        { provide: DeleteTask, useValue: deleteTaskSpy }
      ]
    });

    service = TestBed.inject(TaskPresentationService);
    mockGetAllTasks = TestBed.inject(GetAllTasks) as jasmine.SpyObj<GetAllTasks>;
    mockGetTask = TestBed.inject(GetTask) as jasmine.SpyObj<GetTask>;
    mockAddTask = TestBed.inject(AddTask) as jasmine.SpyObj<AddTask>;
    mockUpdateTask = TestBed.inject(UpdateTask) as jasmine.SpyObj<UpdateTask>;
    mockDeleteTask = TestBed.inject(DeleteTask) as jasmine.SpyObj<DeleteTask>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize tasks on construction', () => {
    expect(mockGetAllTasks.call).toHaveBeenCalled();
  });

  it('should get tasks', (done) => {
    service.getTasks().subscribe(tasks => {
      expect(tasks).toEqual(mockTasks);
      done();
    });
  });

  it('should get current tasks synchronously', () => {
    const tasks = service.getCurrentTasks();
    expect(tasks).toEqual(mockTasks);
  });

  it('should get task by id', (done) => {
    service.getTaskById('1').subscribe(task => {
      expect(task).toEqual(mockTasks[0]);
      expect(mockGetTask.call).toHaveBeenCalledWith('1');
      done();
    });
  });

  it('should add task', (done) => {
    const newTask = mockTasks[0];
    service.addTask(newTask).subscribe(task => {
      expect(task).toEqual(newTask);
      expect(mockAddTask.call).toHaveBeenCalledWith({
        id: newTask.id,
        title: newTask.title,
        categoryId: newTask.categoryId,
        categoryName: newTask.categoryName
      });
      done();
    });
  });

  it('should update task', (done) => {
    const updatedTask = mockTasks[0];
    service.updateTask(updatedTask).subscribe(task => {
      expect(task).toEqual(updatedTask);
      expect(mockUpdateTask.call).toHaveBeenCalledWith({
        id: updatedTask.id,
        title: updatedTask.title,
        completed: updatedTask.completed,
        categoryId: updatedTask.categoryId,
        categoryName: updatedTask.categoryName
      });
      done();
    });
  });

  it('should delete task', (done) => {
    service.deleteTask('1').subscribe(deleted => {
      expect(deleted).toBe(true);
      expect(mockDeleteTask.call).toHaveBeenCalledWith('1');
      done();
    });
  });

  it('should refresh tasks', () => {
    spyOn(service as any, 'initializeTasks');
    service.refreshTasks();
    expect((service as any).initializeTasks).toHaveBeenCalled();
  });

  it('should get tasks by category', (done) => {
    service.getTasksByCategory('Category 1').subscribe(categoryTasks => {
      expect(categoryTasks.length).toBe(1);
      expect(categoryTasks[0].categoryName).toBe('Category 1');
      done();
    });
  });

  it('should get completed tasks count', () => {
    const completedCount = service.getCompletedTaskCount();
    expect(completedCount).toBe(1); // Solo una tarea está completada en mockTasks
  });

  it('should get pending tasks count', () => {
    const pendingCount = service.getPendingTaskCount();
    expect(pendingCount).toBe(1); // Solo una tarea está pendiente en mockTasks
  });

  it('should check if task exists', () => {
    const exists = service.taskExists('1');
    expect(exists).toBe(true);
    
    const notExists = service.taskExists('999');
    expect(notExists).toBe(false);
  });

  it('should get total tasks count', () => {
    const count = service.getTaskCount();
    expect(count).toBe(mockTasks.length);
  });
});
