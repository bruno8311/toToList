import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../entities/category';
import { CategoryRepository } from '../../repositories/category_repository';
import { CATEGORY_REPOSITORY_TOKEN } from '../../tokens/injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class GetCategory {
  
  constructor(@Inject(CATEGORY_REPOSITORY_TOKEN) private readonly repository: CategoryRepository) {}

  call(id: string): Observable<Category | null> {
    if (!id || id.trim().length === 0) {
      throw new Error('ID de categoría no válido');
    }
    
    return this.repository.getCategory(id);
  }
}
