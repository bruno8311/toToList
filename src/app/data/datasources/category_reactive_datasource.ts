import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CategoryItemModel } from '../models/category_item_model';
import { CategoryLocalDatasource } from './category_local_datasource';

@Injectable({
  providedIn: 'root'
})
export class CategoryReactiveDatasource {
  private categoriesSubject = new BehaviorSubject<CategoryItemModel[]>([]);
  
  public categories$ = this.categoriesSubject.asObservable();

  constructor(
    private localDatasource: CategoryLocalDatasource
  ) {
    this.initializeCategories();
  }

  private async initializeCategories(): Promise<void> {
    try {
      this.localDatasource.getAllCategories().subscribe(categories => {
        this.categoriesSubject.next(categories);
      });
    } catch (error) {
      console.error('Error inicializando categorías:', error);
    }
  }

  getCurrentCategories(): CategoryItemModel[] {
    return this.categoriesSubject.value;
  }

  async addCategory(category: CategoryItemModel): Promise<CategoryItemModel> {
    try {
      const savedCategory = await this.localDatasource.saveCategory(category);
      const currentCategories = this.getCurrentCategories();
      this.categoriesSubject.next([...currentCategories, savedCategory]);
      return savedCategory;
    } catch (error) {
      console.error('Error agregando categoría:', error);
      throw error;
    }
  }

  async updateCategory(category: CategoryItemModel): Promise<CategoryItemModel> {
    try {
      const updatedCategory = await this.localDatasource.updateCategory(category);
      const currentCategories = this.getCurrentCategories();
      const updatedCategories = currentCategories.map(cat => 
        cat.id === category.id ? updatedCategory : cat
      );
      this.categoriesSubject.next(updatedCategories);
      return updatedCategory;
    } catch (error) {
      console.error('Error actualizando categoría:', error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const deleted = await this.localDatasource.deleteCategory(id);
      if (deleted) {
        const currentCategories = this.getCurrentCategories();
        const filteredCategories = currentCategories.filter(cat => cat.id !== id);
        this.categoriesSubject.next(filteredCategories);
      }
      return deleted;
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      throw error;
    }
  }

  async refreshCategories(): Promise<void> {
    try {
      this.localDatasource.getAllCategories().subscribe(categories => {
        this.categoriesSubject.next(categories);
      });
    } catch (error) {
      console.error('Error refrescando categorías:', error);
    }
  }

  async categoryNameExists(name: string, excludeId?: string): Promise<boolean> {
    return this.localDatasource.categoryNameExists(name, excludeId);
  }
}
