import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Category } from '../../domain/entities/category';
import { CategoryRepository } from '../../domain/repositories/category_repository';
import { CATEGORY_REPOSITORY_TOKEN } from '../../domain/tokens/injection-tokens';


@Injectable({
  providedIn: 'root'
})
export class CategoryPresentationService {
  
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  constructor(@Inject(CATEGORY_REPOSITORY_TOKEN) private categoryRepository: CategoryRepository) {
    this.initializeCategories();
  }

  private initializeCategories(): void {
    this.categoryRepository.getAllCategories().subscribe(categories => {
      this.categoriesSubject.next(categories);
    });
  }

  getCategories(): Observable<Category[]> {
    return this.categories$;
  }

  getCurrentCategories(): Category[] {
    return this.categoriesSubject.value;
  }

  getCategoryById(id: string): Observable<Category | null> {
    return this.categoryRepository.getCategory(id);
  }

  addCategory(category: Category): Observable<Category> {
    return new Observable(observer => {
      this.categoryRepository.addCategory(category).subscribe(
        savedCategory => {
          observer.next(savedCategory);
          observer.complete();
        },
        error => observer.error(error)
      );
    });
  }

  updateCategory(category: Category): Observable<Category> {
    return new Observable(observer => {
      this.categoryRepository.updateCategory(category).subscribe(
        updatedCategory => {
          observer.next(updatedCategory);
          observer.complete();
        },
        error => observer.error(error)
      );
    });
  }

  deleteCategory(id: string): Observable<boolean> {
    return new Observable(observer => {
      this.categoryRepository.deleteCategory(id).subscribe(
        deleted => {
          observer.next(deleted);
          observer.complete();
        },
        error => observer.error(error)
      );
    });
  }

  refreshCategories(): void {
    this.initializeCategories();
  }

  categoryExists(id: string): boolean {
    return this.getCurrentCategories().some(category => category.id === id);
  }

  getCategoryCount(): number {
    return this.getCurrentCategories().length;
  }
}
