import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../entities/category';
import { CategoryRepository } from '../../repositories/category_repository';
import { CATEGORY_REPOSITORY_TOKEN } from '../../tokens/injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class GetAllCategories {
  
  constructor(@Inject(CATEGORY_REPOSITORY_TOKEN) private readonly repository: CategoryRepository) {}
  call(): Observable<Category[]> {
    return this.repository.getAllCategories();
  }
}
