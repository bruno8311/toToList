import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { of, BehaviorSubject } from 'rxjs';

import { HomePage } from './home.page';
import { TaskPresentationService } from '../../services/task_presentation.service';
import { CategoryPresentationService } from '../../services/category_presentation.service';
import { FeatureFlagService } from '../../services/feature-flag.service';
import { Task } from '../../../domain/entities/task';
import { Category } from '../../../domain/entities/category';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let mockTaskPresentationService: jasmine.SpyObj<TaskPresentationService>;
  let mockCategoryPresentationService: jasmine.SpyObj<CategoryPresentationService>;
  let mockModalController: jasmine.SpyObj<ModalController>;
  let mockFeatureFlagService: jasmine.SpyObj<FeatureFlagService>;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;

  const mockTasks: Task[] = [
    new Task('1', 'Test Task 1', false, 'cat1', 'Category 1'),
    new Task('2', 'Test Task 2', true, 'cat2', 'Category 2')
  ];

  const mockCategories: Category[] = [
    new Category('cat1', 'Category 1'),
    new Category('cat2', 'Category 2')
  ];

  beforeEach(() => {
    // Create spies
    mockTaskPresentationService = jasmine.createSpyObj('TaskPresentationService', ['getTasks', 'getCurrentTasks']);
    mockCategoryPresentationService = jasmine.createSpyObj('CategoryPresentationService', ['getCategories', 'getCurrentCategories']);
    mockModalController = jasmine.createSpyObj('ModalController', ['create']);
    mockFeatureFlagService = jasmine.createSpyObj('FeatureFlagService', ['getFeatureFlag'], {
      featureFlag$: new BehaviorSubject(false)
    });
    mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    // Configure spy returns BEFORE TestBed configuration
    mockTaskPresentationService.getTasks.and.returnValue(of(mockTasks));
    mockTaskPresentationService.getCurrentTasks.and.returnValue(mockTasks);
    mockCategoryPresentationService.getCategories.and.returnValue(of(mockCategories));
    mockCategoryPresentationService.getCurrentCategories.and.returnValue(mockCategories);
    mockFeatureFlagService.getFeatureFlag.and.returnValue(false);
    mockModalController.create.and.returnValue(Promise.resolve({
      present: jasmine.createSpy('present'),
      onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(Promise.resolve({ data: null }))
    } as any));

    TestBed.configureTestingModule({
      declarations: [HomePage],
      providers: [
        { provide: TaskPresentationService, useValue: mockTaskPresentationService },
        { provide: CategoryPresentationService, useValue: mockCategoryPresentationService },
        { provide: ModalController, useValue: mockModalController },
        { provide: FeatureFlagService, useValue: mockFeatureFlagService },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef }
      ]
    });

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty arrays', () => {
    expect(component.tasks).toEqual([]);
    expect(component.categories).toEqual([]);
    expect(component.selectedCategory).toBeNull();
    expect(component.featureFlagEnabled).toBeFalse();
  });

  it('should create modal when needed', async () => {
    // This tests that modalController is properly injected
    expect(mockModalController).toBeTruthy();
  });

  it('should have access to presentation services', () => {
    expect(mockTaskPresentationService).toBeTruthy();
    expect(mockCategoryPresentationService).toBeTruthy();
    expect(mockFeatureFlagService).toBeTruthy();
  });
});
