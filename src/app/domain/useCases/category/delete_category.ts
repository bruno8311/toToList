import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryRepository } from '../../repositories/category_repository';
import { CATEGORY_REPOSITORY_TOKEN } from '../../tokens/injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class DeleteCategory {
  
  constructor(@Inject(CATEGORY_REPOSITORY_TOKEN) private readonly repository: CategoryRepository) {}

  call(id: string): Observable<boolean> {
    if (!id || id.trim().length === 0) {
      throw new Error('ID de categoría no válido');
    }
    return this.repository.deleteCategory(id);
  }
}
