import { Observable } from 'rxjs';
import { Category } from '../entities/category';

/**
 * Interfaz del repositorio para Category
 * Define el contrato que debe cumplir cualquier implementación
 */
export interface CategoryRepository {
  getAllCategories(): Observable<Category[]>;
  getCategory(id: string): Observable<Category | null>;
  addCategory(category: Category): Observable<Category>;
  updateCategory(category: Category): Observable<Category>;
  deleteCategory(id: string): Observable<boolean>;
}
