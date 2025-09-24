import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CategoryPresentationService } from './category_presentation.service';
import { CategoryRepository } from '../../domain/repositories/category_repository';
import { Category } from '../../domain/entities/category';

describe('CategoryPresentationService', () => {
  let service: CategoryPresentationService;
  let mockCategoryRepository: jasmine.SpyObj<CategoryRepository>;

  const mockCategories: Category[] = [
    new Category('1', 'Test Category 1'),
    new Category('2', 'Test Category 2')
  ];

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CategoryRepository', [
      'getAllCategories',
      'getCategory',
      'addCategory',
      'updateCategory',
      'deleteCategory'
    ]);

    // Setup spy returns BEFORE creating the service
    spy.getAllCategories.and.returnValue(of(mockCategories));
    spy.getCategory.and.returnValue(of(mockCategories[0]));
    spy.addCategory.and.returnValue(of(mockCategories[0]));
    spy.updateCategory.and.returnValue(of(mockCategories[0]));
    spy.deleteCategory.and.returnValue(of(true));

    TestBed.configureTestingModule({
      providers: [
        CategoryPresentationService,
        { provide: CategoryRepository, useValue: spy }
      ]
    });

    service = TestBed.inject(CategoryPresentationService);
    mockCategoryRepository = TestBed.inject(CategoryRepository) as jasmine.SpyObj<CategoryRepository>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize categories on construction', () => {
    expect(mockCategoryRepository.getAllCategories).toHaveBeenCalled();
  });

  it('should get categories', (done) => {
    service.getCategories().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
      done();
    });
  });

  it('should get current categories synchronously', () => {
    const categories = service.getCurrentCategories();
    expect(categories).toEqual(mockCategories);
  });

  it('should get category by id', (done) => {
    service.getCategoryById('1').subscribe(category => {
      expect(category).toEqual(mockCategories[0]);
      expect(mockCategoryRepository.getCategory).toHaveBeenCalledWith('1');
      done();
    });
  });

  it('should add category', (done) => {
    const newCategory = mockCategories[0];
    service.addCategory(newCategory).subscribe(category => {
      expect(category).toEqual(newCategory);
      expect(mockCategoryRepository.addCategory).toHaveBeenCalledWith(newCategory);
      done();
    });
  });

  it('should update category', (done) => {
    const updatedCategory = mockCategories[0];
    service.updateCategory(updatedCategory).subscribe(category => {
      expect(category).toEqual(updatedCategory);
      expect(mockCategoryRepository.updateCategory).toHaveBeenCalledWith(updatedCategory);
      done();
    });
  });

  it('should delete category', (done) => {
    service.deleteCategory('1').subscribe(deleted => {
      expect(deleted).toBe(true);
      expect(mockCategoryRepository.deleteCategory).toHaveBeenCalledWith('1');
      done();
    });
  });

  it('should refresh categories', () => {
    spyOn(service as any, 'initializeCategories');
    service.refreshCategories();
    expect((service as any).initializeCategories).toHaveBeenCalled();
  });

  it('should check if category exists', () => {
    const exists = service.categoryExists('1');
    expect(exists).toBe(true);
    
    const notExists = service.categoryExists('999');
    expect(notExists).toBe(false);
  });

  it('should get category count', () => {
    const count = service.getCategoryCount();
    expect(count).toBe(mockCategories.length);
  });
});
